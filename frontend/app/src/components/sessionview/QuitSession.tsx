import react, {useEffect, useState} from "react";
import {Backdrop, createStyles, makeStyles, Theme, Card, CardContent, Typography, Button} from "@material-ui/core";
import {useRecoilState, useRecoilValue} from "recoil";
import {popupOpen} from "../../state/SessionViewState/SessionViewAtoms";
import {selectedStudentRecordingState} from "../../state/recording/recordingAtoms";

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
            height: "250px",
            backgroundColor: theme.palette.background.default,
            transition: "all 0.25s"
        },
        btn: {
            color: theme.palette.text.default,
            fontWeight: "bold"
        },
        btnGroup: {
            width: "220px",
            float: "right",
            marginLeft: "140px",
            display: "flex",
            justifyContent: "space-between"
        },
        cardContent: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "210px"
        },
        emphasizedText: {
            fontWeight: "bold",
            color: theme.palette.text.default
        }
    })
);

interface Props {
    sessionName: string;
    studentName: string;
}

export default function QuitSesson(props: Props): JSX.Element {
    const classes = useStyles();

    const [status, setPopupOpen] = useRecoilState(popupOpen);
    const [isRecording, setIsRecording] = useRecoilState(selectedStudentRecordingState);

    //stops recording, closes popup, and goes to the startview
    const quitSession = () => {
        setIsRecording(false);
        setPopupOpen(false);
    };

    return (
        <div>
            <Backdrop className={classes.backdrop} open={status}>
                <Card className={classes.root} onClick={(e) => e.stopPropagation()}>
                    <CardContent className={classes.cardContent}>
                        <Typography variant={"h1"}>Quit Session</Typography>
                        <div>
                            <Typography>
                                Are you sure you want to quit{" "}
                                <span className={classes.emphasizedText}>{props.sessionName}</span> with{" "}
                                <span className={classes.emphasizedText}>{props.studentName}</span>?
                            </Typography>

                            {isRecording && (
                                <div>
                                    <br /> <Typography>This will also stop the ongoing recording</Typography>
                                </div>
                            )}
                        </div>
                        <div className={classes.btnGroup}>
                            <Button
                                onClick={() => {
                                    setPopupOpen(false);
                                }}
                            >
                                Cancel
                            </Button>

                            <Button variant="contained" color="primary" onClick={quitSession} className={classes.btn}>
                                Quit session
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </Backdrop>
        </div>
    );
}
