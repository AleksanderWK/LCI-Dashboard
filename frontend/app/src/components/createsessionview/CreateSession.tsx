import react, {useEffect, useState} from "react";
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
import React from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {popupOpen} from "../../state/CreateSessionViewState/createSessionViewAtoms";
import {students} from "../../state/data/studentAtoms";
import {ipcGet} from "../../ipc";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paperStyles: {
            width: "325px",
            height: "450px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
            color: theme.palette.text.default,
            fontWeight: "bold"
        },
        placeholder: {
            color: theme.palette.text.placeholder
        }
    })
);

export interface sessionSelections {
    sessionName: string;
    studentName: string;
    eyeTracker: string;
}

export default function CreateSession(): JSX.Element {
    const classes = useStyles();

    const [sessionSelections, setSessionSelections] = useState<sessionSelections>();
    const [studentConnected, setStudentConnected] = useState<boolean>(false);
    const [sessionToken, setSessionToken] = useState<string>("");
    const [sessionNameNotSet, setSessionNameNotSet] = useState(true);
    const [studentNameNotSet, setStudentNameNotSet] = useState(true);
    const [deviceNotSet, setDeviceNotSet] = useState(true);

    const [status, setPopupOpen] = useRecoilState(popupOpen);
    const studentList = useRecoilValue(students);

    const handleSelectionChange = (selection: string, value: string) => {
        // Overwrite an attribute based on the selection parameter
        const updatedSessionSelections = {
            ...sessionSelections!,
            [selection]: value
        };

        // Save updated menu values to state
        setSessionSelections(updatedSessionSelections);
    };

    const handelCreateSession = () => {
        console.log("create session");
    };

    useEffect(() => {
        ipcGet("getCode").then((code: any) => {
            setSessionToken(code);
        });
    }, []);

    return (
        <div className={classes.paperStyles}>
            <Typography variant="h1" style={{color: "#000000"}}>
                Create New Learning Session
            </Typography>
            <TextField
                className={classes.inputNewSessionName}
                label={"Session Name"}
                onChange={(event: React.ChangeEvent<{value: unknown}>) => {
                    handleSelectionChange("sessionName", event.target.value as string);
                    setSessionNameNotSet(!event.target.value);
                }}
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
                                (document.activeElement! as HTMLElement).blur();
                            }, 60);
                        }}
                        input={<Input />}
                        classes={{root: classes.inputSelectStudent}}
                        onChange={(event: React.ChangeEvent<{value: unknown}>) => {
                            handleSelectionChange("studentName", event.target.value as string);
                            setStudentNameNotSet(!event.target.value);
                        }}
                    >
                        {studentList.map((option: string) => (
                            <MenuItem key={option} value={option} data-testid={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <IconButton
                    color="primary"
                    aria-label="add new student"
                    className={classes.addStudentBtn}
                    onClick={() => {
                        setPopupOpen(true);
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
                >
                    <FormControlLabel value="stationary" control={<Radio />} label="Stationary" />
                    <FormControlLabel value="mobile" control={<Radio />} label="Mobile" style={{marginLeft: "20px"}} />
                </RadioGroup>
            </div>
            <div className={classes.sessionInfoContainer}>
                <Typography variant="caption">Session code</Typography>

                <Typography variant="caption" className={classes.sessionToken}>
                    {sessionToken}
                </Typography>
                {studentConnected ? (
                    <Typography variant="caption" style={{color: "#5BA350"}}>
                        Student has connected
                    </Typography>
                ) : (
                    <Typography variant="caption" style={{color: "#DD5757"}}>
                        Waiting for student connection...
                    </Typography>
                )}
            </div>
            {!sessionNameNotSet && !studentNameNotSet && !deviceNotSet && studentConnected ? (
                <Button variant="contained" color="primary" onClick={handelCreateSession} className={classes.btn}>
                    Create session
                </Button>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handelCreateSession}
                    disabled={true}
                    name="submitBtn"
                    className={classes.btn}
                >
                    Create session
                </Button>
            )}
        </div>
    );
}
