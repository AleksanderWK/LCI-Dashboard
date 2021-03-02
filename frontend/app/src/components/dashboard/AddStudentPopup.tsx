import react, {useState} from "react";
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

interface Props {
    open: boolean;
    handlePopupClose: () => void;
}

export default function AddStudentPopup(props: Props): JSX.Element {
    const classes = useStyles();

    const [studentNameNotSet, setStudentNameNotSet] = useState(true);
    const [studentName, setStudentName] = useState<string>("");

    const handleClose = () => {
        if (props.open) {
            props.handlePopupClose();
        }
    };

    const addStudent = () => {
        //
    };

    return (
        <div>
            <Backdrop className={classes.backdrop} open={props.open}>
                <Card className={classes.root} onClick={(e) => e.stopPropagation()}>
                    <CardContent className={classes.cardContent}>
                        <Typography variant={"h1"}>Add Student</Typography>
                        <TextField
                            className={classes.inputNewStudentName}
                            label={"Student Name"}
                            onChange={(event: React.ChangeEvent<{value: unknown}>) => {
                                setStudentName(event.target.value as string);
                                setStudentNameNotSet(!event.target.value);
                            }}
                        />
                        <div className={classes.btnGroup}>
                            <Button onClick={handleClose}>Cancel</Button>
                            {!studentNameNotSet ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={addStudent}
                                    className={classes.btn}
                                    startIcon={<AddCircleRoundedIcon />}
                                >
                                    Add student
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={true}
                                    className={classes.btn}
                                    startIcon={<AddCircleRoundedIcon />}
                                >
                                    Add student
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </Backdrop>
        </div>
    );
}
