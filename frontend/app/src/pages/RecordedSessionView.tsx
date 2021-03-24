import {createStyles, makeStyles} from "@material-ui/core";
import {useEffect} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import IntervalSlider from "../components/recordedsessionview/IntervalSlider";
import Header from "../components/recordedsessionview/Header";
import Container from "../components/dashboard/recording/Container";
import {Variable} from "../constants";
import {ipcInvoke} from "../ipc";
import {selectedRecordedSessionIdState, RecordedSession, recordedSessionState} from "../state/recordedSession";

const useStyles = makeStyles(() =>
    createStyles({
        pageContainer: {
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "30px auto 30px",
            gridTemplateRows: "125px auto"
        },
        header: {
            gridColumnStart: 1,
            gridColumnEnd: 4,
            gridRowStart: 1,
            gridRowEnd: 2
        },
        dashboard: {
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 2
        }
    })
);

export default function RecordedSessionView(): JSX.Element {
    const classes = useStyles();

    const recordedSessionId = useRecoilValue(selectedRecordedSessionIdState);
    const setRecordedSession = useSetRecoilState(recordedSessionState);

    useEffect(() => {
        if (recordedSessionId) {
            ipcInvoke("getSessionRecording", recordedSessionId).then((session) => {
                setRecordedSession(session as RecordedSession);
            });
        }
    }, [recordedSessionId]);

    return (
        <div className={classes.pageContainer}>
            <div className={classes.header}>
                <Header />
            </div>
            <div className={classes.dashboard}>
                <Container variable={Variable.PerceivedDifficulty} />
            </div>
        </div>
    );
}
