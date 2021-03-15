import React, {useEffect, useState} from "react";
import {
    makeStyles,
    createStyles,
    Theme,
    Typography,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
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
import {selectedSessionIdState, sessionIdsState, sessionRecordingState, sessionState} from "../../state/session";
import {EyeTrackingDevice} from "../../constants";

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

export default function CreateSession(): JSX.Element {
    const classes = useStyles();

    const [createSessionValues, setCreateSessionValues] = useRecoilState(createSessionValuesState);
    const resetCreateSessionValues = useResetRecoilState(createSessionValuesState);

    const [sessionNameNotSet, setSessionNameNotSet] = useState(true);
    const [studentNameNotSet, setStudentNameNotSet] = useState(true);
    const [deviceNotSet, setDeviceNotSet] = useState(true);

    const [addStudentPopupOpen, setAddStudentPopupOpen] = useRecoilState(addStudentPopupOpenState);
    const setCreateSessionPopupOpen = useSetRecoilState(createSessionPopupOpenState);

    const [students, setStudents] = useRecoilState(studentsState);

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        // Get users from DB when component loads
        ipcGet<Student[]>("getUsers").then((students) => {
            setStudents(students);
        });

        ipcOnce("readyConnection", (event: any, data: any) => {
            setCreateSessionValues((prevValues) => ({
                ...prevValues,
                studentConnected: true
            }));
        });
    }, [addStudentPopupOpen]);

    const handleSelectionChange = (selection: string, value: string) => {
        // Overwrite an attribute based on the selection parameter
        const updatedSessionSelections = {
            ...createSessionValues,
            [selection]: value
        };

        // Save updated menu values to state
        setCreateSessionValues(updatedSessionSelections);
    };

    const createSession = useRecoilCallback(({set}) => (sessionId: number) => {
        set(sessionState(sessionId), {
            sessionId: sessionId,
            sessionName: createSessionValues.sessionName,
            studentId: createSessionValues.studentId,
            eyeTrackingDevice:
                createSessionValues.eyeTracker === "Mobile" ? EyeTrackingDevice.Mobile : EyeTrackingDevice.Stationary,
            startTime: new Date()
        });

        set(sessionIdsState, (prevValue) => [...prevValue, sessionId]);

        set(sessionRecordingState(sessionId), {status: false, startTime: null});

        set(selectedSessionIdState, sessionId);
    });

    const handleCreateSession = () => {
        // Reset values
        resetCreateSessionValues();

        ipcSend("startDatastream", {});
        ipcInvoke("insertSession", {...createSessionValues, data: []}).then((sessionId) => {
            createSession(sessionId as number);
        });

        if (location.pathname === "/create-session") {
            history.push("session");
        } else if (location.pathname === "/session") {
            setCreateSessionPopupOpen(false);
        }
    };

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
            </div>

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

            <div className={classes.sessionInfoContainer}>
                <Typography variant="caption">Session code</Typography>

                <Typography variant="caption" className={classes.sessionToken}>
                    {createSessionValues.sessionCode}
                </Typography>
                {createSessionValues.studentConnected ? (
                    <Typography variant="caption" style={{color: "#5BA350"}}>
                        Student has connected
                    </Typography>
                ) : (
                    <Typography
                        variant="caption"
                        style={createSessionValues.studentConnected ? {color: "#00FF00"} : {color: "#DD5757"}}
                    >
                        {createSessionValues.studentConnected
                            ? "Student connected"
                            : "Waiting for student connection..."}
                    </Typography>
                )}
            </div>
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateSession}
                    disabled={
                        sessionNameNotSet || studentNameNotSet || deviceNotSet || !createSessionValues.studentConnected
                    }
                    name="submitBtn"
                    className={classes.btn}
                    style={{marginRight: 8}}
                >
                    Create session
                </Button>
                <Button
                    onClick={() => {
                        if (location.pathname === "/create-session") {
                            history.push("/");
                        } else if (location.pathname === "/session") {
                            setCreateSessionPopupOpen(false);
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
