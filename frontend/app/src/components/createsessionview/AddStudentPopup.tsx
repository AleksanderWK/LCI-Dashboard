import react, {useEffect, useState} from "react";
import {
    Backdrop,
    createStyles,
    makeStyles,
    Theme,
    Card,
    CardContent,
    Typography,
    TextField,
    Button
} from "@material-ui/core";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import {useRecoilState} from "recoil";
import {popupOpen} from "../../state/CreateSessionViewState/createSessionViewAtoms";
import {students} from "../../state/data/studentAtoms";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            color: "#fff",
            alignItems: "center",
            overflowY: "auto",
            zIndex: 20 //should have zindex in theme
        },
        root: {
            width: "400px",
            height: "200px",
            backgroundColor: theme.palette.background.default,
            transition: "all 0.25s"
        },
        inputNewStudentName: {
            width: "100%"
        },
        btn: {
            color: theme.palette.text.default,
            fontWeight: "bold"
        },
        btnGroup: {
            width: "240px",
            float: "right",
            marginLeft: "140px"
        },
        cardContent: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "160px"
        }
    })
);

export default function AddStudentPopup(): JSX.Element {
    const classes = useStyles();

    const [studentNameNotSet, setStudentNameNotSet] = useState(true);
    const [studentName, setStudentName] = useState<string>("");
    const [inputError, setInputError] = useState<boolean>(false);
    const [status, setPopupOpen] = useRecoilState(popupOpen);
    const [student_list, setStudentList] = useRecoilState(students);

    const addStudent = () => {
        //if student is in list already prevent action and show error on screen
        if (student_list.includes(studentName) || studentName == "") {
            setInputError(true);
        } else {
            //Add student and close popup
            const newList = student_list.concat(studentName);
            setStudentList(newList);
            setPopupOpen(false);
        }
    };

    //Remove error message if user starts rewriting error-triggering student name.
    useEffect(() => {
        setInputError(false);
    }, [studentName]);

    return (
        <div>
            <Backdrop className={classes.backdrop} open={status}>
                <Card className={classes.root} onClick={(e) => e.stopPropagation()}>
                    <CardContent className={classes.cardContent}>
                        <Typography variant={"h1"}>Add Student</Typography>
                        <TextField
                            className={classes.inputNewStudentName}
                            label={"Student Name"}
                            inputProps={{"data-testid": "content-input"}}
                            onChange={(event: React.ChangeEvent<{value: unknown}>) => {
                                setStudentName(event.target.value as string);
                                setStudentNameNotSet(!event.target.value);
                            }}
                            error={inputError}
                        />
                        <div className={classes.btnGroup}>
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
                                startIcon={<AddCircleRoundedIcon />}
                            >
                                Add student
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </Backdrop>
        </div>
    );
}
