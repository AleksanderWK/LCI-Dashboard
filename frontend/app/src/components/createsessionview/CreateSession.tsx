import React, {useEffect, useState} from "react";
import {
    makeStyles,
    createStyles,
    Theme,
    Typography,
    TextField,
    Button,
    Input,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton
} from "@material-ui/core";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import {useRecoilCallback, useRecoilState, useResetRecoilState, useSetRecoilState} from "recoil";
import {ipcGet, ipcInvoke, ipcOnce, ipcSend} from "../../ipc";
import {createSessionValuesState} from "../../state/createSession";
import {addStudentPopupOpenState, createSessionPopupOpenState} from "../../state/popup";
import {Student, studentsState} from "../../state/student";
import {useHistory, useLocation} from "react-router-dom";
import {
    selectedSessionIdState,
    Session,
    sessionIdsState,
    sessionRecordingState,
    sessionState
} from "../../state/session";
import {EyeTrackingDevice} from "../../constants";
import {StyledTooltipBottom, StyledTooltipRight} from "../common/Tooltips";
import {CopyIcon} from "../common/Icons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 36,
            color: theme.palette.text.default
        },
        inputNewSessionName: {
            width: "100%"
        },
        hasText: {
            borderBottomColor: theme.palette.secondary.main
        },
        inputSelectStudent: {
            width: "250px"
        },
        addStudentBtn: {
            marginTop: "10px"
        },
        addStudentContainer: {
            display: "flex",
            justifyContent: "space-between"
        },
        sessionToken: {
            fontSize: "20px",
            fontWeight: 600,
            letterSpacing: "2px"
        },
        sessionInfoContainer: {
            height: "70px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
        },
        btn: {
            color: theme.palette.text.default
        },
        placeholder: {
            color: theme.palette.text.placeholder
        },
        noStudentsPromptContainer: {
            width: "250px",
            height: "auto",
            color: theme.palette.text.placeholder
        }
    })
);

/**
 * A component that handles creation of new live sessions
 */
export default function CreateSession(): JSX.Element {
    const classes = useStyles();

    const [createSessionValues, setCreateSessionValues] = useRecoilState(createSessionValuesState);
    const resetCreateSessionValues = useResetRecoilState(createSessionValuesState);

    const [sessionNameNotSet, setSessionNameNotSet] = useState(true);
    const [studentNameNotSet, setStudentNameNotSet] = useState(true);

    const setAddStudentPopupOpen = useSetRecoilState(addStudentPopupOpenState);
    const setCreateSessionPopupOpen = useSetRecoilState(createSessionPopupOpenState);

    const [students, setStudents] = useRecoilState(studentsState);

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        // Get users from data store when component loads
        ipcGet<Student[]>("getUsers").then((students) => {
            setStudents(students);
        });

        // When student has connected, update application state
        ipcOnce("readyConnection", (event: any, data: any) => {
            setCreateSessionValues((prevValues) => ({
                ...prevValues,
                studentConnected: true
            }));
        });
    }, []);

    /**
     * Updates create session values state with new values
     * @param {string} selection - The field that has changed
     * @param {string} value - The new value of the field that has changed
     */
    const handleSelectionChange = (selection: string, value: string) => {
        let student = undefined;

        if (selection == "studentId") {
            student = students.find((student) => student._id == value);
        }

        // Overwrite an attribute based on the selection parameter
        const updatedSessionSelections = {
            ...createSessionValues,
            [selection]: value,
            ...(selection == "studentId" && student && {studentName: student.name})
        };

        // Save updated menu values to state
        setCreateSessionValues(updatedSessionSelections);
    };

    /**
     * Updates application state when a new session is made
     */
    const createSession = useRecoilCallback(({set}) => (session: Session) => {
        set(sessionState(session._id), session);

        set(sessionIdsState, (prevValue) => [...prevValue, session._id]);

        set(sessionRecordingState(session._id), {status: false, startTime: null, recordingId: null});

        // Select the newly created session
        set(selectedSessionIdState, session._id);
    });

    /**
     * Handles creation of a new session
     */
    const handleCreateSession = () => {
        // Start receiving data from the backend
        ipcSend("startDatastream", createSessionValues.sessionCode);

        const session: Partial<Session> = {
            sessionName: createSessionValues.sessionName,
            studentId: createSessionValues.studentId,
            studentName: createSessionValues.studentName,
            eyeTrackingDevice:
                createSessionValues.eyeTracker === "Mobile" ? EyeTrackingDevice.Mobile : EyeTrackingDevice.Stationary,
            startTime: new Date().getTime(),
            endTime: null,
            sessionCode: createSessionValues.sessionCode
        };

        // Insert the session into the data store
        ipcInvoke("insertSession", session).then((sessionId) => {
            session._id = sessionId as number;
            createSession(session as Session);
        });

        // Reset create session values (fields)
        resetCreateSessionValues();

        // Go to SessionView if in CreateSessionView, or close the popup if already in SessionView
        if (location.pathname === "/create-session") {
            history.push("session");
        } else if (location.pathname === "/session") {
            setCreateSessionPopupOpen(false);
        }
    };

    /**
     * When values are field values are changed, check if inputs are valid
     */
    useEffect(() => {
        if (createSessionValues.sessionName) {
            setSessionNameNotSet(false);
        } else {
            setSessionNameNotSet(true);
        }

        if (createSessionValues.studentId) {
            setStudentNameNotSet(false);
        } else {
            setStudentNameNotSet(true);
        }

        if (!createSessionValues.sessionCode) {
            ipcGet("getCode").then((code: any) => {
                handleSelectionChange("sessionCode", code);
            });
        }
    }, [createSessionValues]);

    return (
        <div className={classes.form}>
            <Typography variant="h1" style={{color: "#000000"}}>
                Create New Learning Session
            </Typography>

            <TextField
                className={classes.inputNewSessionName}
                label={"Session name"}
                onChange={(event: React.ChangeEvent<{value: unknown}>) => {
                    handleSelectionChange("sessionName", event.target.value as string);
                }}
                value={createSessionValues.sessionName}
            />

            <div className={classes.addStudentContainer}>
                <FormControl>
                    <InputLabel id="label" className={classes.placeholder}>
                        Student
                    </InputLabel>
                    <Select
                        labelId="label"
                        onClose={() => {
                            // Remove input field focus when selection is closed
                            setTimeout(() => {
                                (document.activeElement as HTMLElement).blur();
                            }, 60);
                        }}
                        input={<Input />}
                        classes={{root: classes.inputSelectStudent}}
                        onChange={(event: React.ChangeEvent<{value: unknown}>) => {
                            handleSelectionChange("studentId", event.target.value as string);
                        }}
                        value={
                            students.some((student) => student._id === createSessionValues.studentId)
                                ? createSessionValues.studentId
                                : ""
                        }
                    >
                        {students.length > 0 ? (
                            students.map((student: Student) => (
                                <MenuItem key={student._id} value={student._id} data-testid={student.name}>
                                    {student.name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem
                                className={classes.noStudentsPromptContainer}
                                disabled
                                style={{whiteSpace: "normal", margin: "auto", textAlign: "center"}}
                            >
                                <p>You have not added any students yet. Click on the + button to add a new student.</p>
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>
                <StyledTooltipBottom title="Add student" placement="bottom">
                    <IconButton
                        color="primary"
                        aria-label="add new student"
                        className={classes.addStudentBtn}
                        onClick={() => {
                            setAddStudentPopupOpen(true);
                        }}
                    >
                        <AddCircleRoundedIcon />
                    </IconButton>
                </StyledTooltipBottom>
            </div>
            {
                // TODO: Implement constraints in frontend based on the chosen eye tracking device,
                // i.e. which variables the user can choose to view. See user story 5.
                // Selection can either be done in the backend or the frontend.
                // If done in the frontend, the below code can be used.
                /*
                <div>
                    <Typography variant="caption">Eye tracking device</Typography>
                    <RadioGroup
                        row
                        aria-label="eye tracker decive"
                        name="eyetracker"
                        onChange={(event: React.ChangeEvent<{value: unknown}>) => {
                            handleSelectionChange("eyeTracker", event.target.value as string);

                            setDeviceNotSet(!event.target.value);
                        }}
                        value={createSessionValues.eyeTracker}
                    >
                        <FormControlLabel value="stationary" control={<Radio />} label="Stationary" />
                        <FormControlLabel value="mobile" control={<Radio />} label="Mobile" style={{marginLeft: "20px"}} />
                    </RadioGroup>
                </div>
                */
            }

            <div className={classes.sessionInfoContainer}>
                <Typography variant="caption">Session code</Typography>
                <div>
                    <Typography variant="caption" className={classes.sessionToken}>
                        {createSessionValues.sessionCode}
                    </Typography>
                    <StyledTooltipRight title="Copy" placement="right">
                        <IconButton
                            aria-label="copy-to-clipboard"
                            size="small"
                            style={{margin: "0px 0px 7px 5px"}}
                            onClick={() => {
                                navigator.clipboard.writeText(createSessionValues.sessionCode);
                            }}
                        >
                            <CopyIcon viewBox="-3 -3 25 25" />
                        </IconButton>
                    </StyledTooltipRight>
                </div>
                {createSessionValues.studentConnected ? (
                    <Typography variant="caption" style={{color: "#5BA350"}}>
                        Student has connected
                    </Typography>
                ) : (
                    <Typography variant="caption" style={{color: "#DD5757"}}>
                        Waiting for student connection...
                    </Typography>
                )}
            </div>
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateSession}
                    disabled={sessionNameNotSet || studentNameNotSet || !createSessionValues.studentConnected}
                    name="submitBtn"
                    className={classes.btn}
                    style={{marginRight: 8}}
                >
                    Create session
                </Button>
                <Button
                    onClick={() => {
                        // On cancel, either go to the StartView if in CreateSessionView,
                        // or close the popup if in SessionView
                        if (location.pathname === "/create-session") {
                            history.push("/");
                            resetCreateSessionValues();
                        } else if (location.pathname === "/session") {
                            setCreateSessionPopupOpen(false);
                            resetCreateSessionValues();
                        }
                    }}
                    name="cancelBtn"
                    className={classes.btn}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
