import {BrowserRouter, Route, Switch} from "react-router-dom";
import SessionView from "./pages/SessionView";
import CreateSessionView from "./pages/CreateSessionView";
import {useEffect} from "react";
import {ipcOn, ipcSend} from "./ipc";
import {Data, selectedSessionIdState, sessionDataState, sessionRecordingState} from "./state/session";
import {useRecoilCallback} from "recoil";
import {Variable} from "./constants";
import StartView from "./pages/StartView";
import RecordedSessionView from "./pages/RecordedSessionView";

export interface DataPoints {
    [key: string]: number;
    [Variable.CognitiveLoad]: number;
    [Variable.PerceivedDifficulty]: number;
    [Variable.Familiarity]: number;
    [Variable.InformationProcessingIndex]: number;
    [Variable.PhysiologicalArousal]: number;
    [Variable.Engagement]: number;
    [Variable.PhysiologicalStress]: number;
    [Variable.EmotionalRegulation]: number;
    [Variable.MotionStability]: number;
    [Variable.EnergySpentFatigue]: number;
}

function App(): JSX.Element {
    const addDataPointToState = useRecoilCallback(({snapshot, set}) => (dataPoints: DataPoints) => {
        const now = new Date().getTime();

        // TEMPORARY: Add incoming data point to selected session
        const sessionId = snapshot.getLoadable(selectedSessionIdState).getValue();

        set(sessionDataState(sessionId), (prevVal) => {
            return (Object.fromEntries(
                Object.entries(prevVal).map(([k, v]) => [k, [...v, [now, +(dataPoints[k] * 100).toFixed()]]])
            ) as unknown) as Data;
        });

        const sessionRecording = snapshot.getLoadable(sessionRecordingState(sessionId)).getValue();

        if (sessionRecording.status) {
            ipcSend("pushDataPointToSession", {
                timestamp: now,
                data: dataPoints,
                sessionId: sessionId,
                recordingId: sessionRecording.recordingId
            });
        }
    });

    useEffect(() => {
        ipcOn("newData", (event: any, data: DataPoints) => {
            addDataPointToState(data);
        });

        ipcSend("startServer", true);
    }, []);

    return (
        <BrowserRouter>
            <Switch>
                {/*
                    Add new pages by adding a Route component. (Important! they need to be above the startview route) Use the Link component from react-router-dom in other compoenents to navigate to Routes specified here. 
                */}
                <Route path="/recording" component={RecordedSessionView} />
                <Route path="/create-session" component={CreateSessionView} />
                <Route path="/session" component={SessionView} />
                <Route path="/" component={StartView} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
