import React, {useEffect} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import Header from "../components/recordedsessionview/Header";
import {ipcInvoke} from "../ipc";
import {selectedRecordedSessionIdState, RecordedSession, recordedSessionState} from "../state/recordedSession";
import Footer from "../components/recordedsessionview/Footer";
import Dashboard from "../components/dashboard/recording/Dashboard";
import {createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        pageContainer: {
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "30px auto 30px",
            gridTemplateRows: "125px auto"
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
        <>
            <div className={classes.pageContainer}>
                <Header />
                <Dashboard />
            </div>
            <Footer />
        </>
    );
}
