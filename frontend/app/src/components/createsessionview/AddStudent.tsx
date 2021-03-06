import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, Theme, Typography, TextField, Button, CardActions} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {useRecoilState, useSetRecoilState} from "recoil";
import {
    addStudentPopupOpenState,
    createSessionValuesState
} from "../../state/CreateSessionViewState/createSessionViewAtoms";
import {students, User} from "../../state/data/studentAtoms";
import {ipcGet, ipcSend} from "../../ipc";

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
    const [student_list, setStudentList] = useRecoilState(students);

    const addStudent = () => {
        // If student is in list already prevent action and show error on screen
        if (student_list.includes(studentName) || studentName == "") {
            setInputError(true);
        } else {
            // Add student, choose the student and close popup
            ipcSend("insertUser", {name: studentName});
            const newList = student_list.concat(studentName);
            setStudentList(newList);
            setCreateSessionValues((prevValues) => ({
                ...prevValues,
                studentName: studentName
            }));
            setPopupOpen(false);
        }
    };

    // Remove error message if user starts rewriting error-triggering student name.
    useEffect(() => {
        setInputError(false);
        ipcGet<User[]>("getUsers").then((users) => {
            setStudentList(users.map((user) => user.name));
        });
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
