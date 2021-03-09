import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, Theme, Typography, TextField, Button, CardActions} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {useRecoilState, useSetRecoilState} from "recoil";
import {ipcInvoke} from "../../ipc";
import {studentsState} from "../../state/student";
import {addStudentPopupOpenState} from "../../state/popup";
import {createSessionValuesState} from "../../state/createSession";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        form: {
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 36,
            color: theme.palette.text.default
        },
        inputNewStudentName: {
            width: "100%"
        },
        btn: {
            color: theme.palette.text.default,
            fontWeight: "bold"
        }
    })
);

export default function AddStudent(): JSX.Element {
    const classes = useStyles();

    const [studentName, setStudentName] = useState<string>("");
    const [inputError, setInputError] = useState<boolean>(false);

    const setPopupOpen = useSetRecoilState(addStudentPopupOpenState);

    const setCreateSessionValues = useSetRecoilState(createSessionValuesState);

    const [students, setStudents] = useRecoilState(studentsState);

    const addStudent = () => {
        // If student is in list already prevent action and show error on screen
        if (students.some((student) => student.name === studentName) || studentName == "") {
            setInputError(true);
        } else {
            const student = {name: studentName};

            // Add student
            ipcInvoke("insertUser", student).then((studentId) => {
                setStudents((prevValue) => [...prevValue, {...student, _id: studentId as string}]);

                setCreateSessionValues((prevValues) => ({
                    ...prevValues,
                    studentId: studentId as string,
                    studentName: studentName
                }));

                setPopupOpen(false);

                setStudentName("");
                setInputError(false);
            });
        }
    };

    // Remove error message if user starts rewriting error-triggering student name.
    useEffect(() => {
        setInputError(false);
    }, [studentName]);

    return (
        <div className={classes.form}>
            <Typography variant="h1" style={{color: "#000000"}}>
                Add Student
            </Typography>
            <TextField
                className={classes.inputNewStudentName}
                label={"Student name"}
                inputProps={{"data-testid": "content-input"}}
                onChange={(event: React.ChangeEvent<{value: unknown}>) => {
                    setStudentName(event.target.value as string);
                }}
                value={studentName}
                error={inputError}
            />
            <CardActions style={{width: "100%", justifyContent: "flex-end"}}>
                <Button
                    onClick={() => {
                        setPopupOpen(false);
                    }}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={addStudent}
                    className={classes.btn}
                    startIcon={<AddIcon />}
                >
                    Add student
                </Button>
            </CardActions>
        </div>
    );
}
