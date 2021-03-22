import {BrowserRouter, Route, Switch} from "react-router-dom";
import SessionView from "./pages/SessionView";
import CreateSessionView from "./pages/CreateSessionView";
import {useEffect} from "react";
import {ipcOn, ipcSend} from "./ipc";
import {
    Data,
    selectedSessionIdState,
    sessionDataState,
    sessionRecordingState,
    sessionsState,
    SessionWithStudent
} from "./state/session";
import {useRecoilCallback} from "recoil";
import {Variable} from "./constants";
import StartView from "./pages/StartView";

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

export interface DataPayload {
    dataPoints: DataPoints;
    sessionCode: string;
    timestamp: number;
}

function App(): JSX.Element {
    const addDataPointToState = useRecoilCallback(({snapshot, set}) => (data: DataPayload) => {
        const now: number = new Date().getTime();

        // Find the Session with the same sessionCode as this data has
        const session: SessionWithStudent | undefined = snapshot
            .getLoadable(sessionsState)
            .getValue()
            .find((session) => session.sessionCode == data.sessionCode);

        // If we have found the session, set the data in the session state
        if (session != undefined) {
            const sessionId: number = session.sessionId;

            // Set the data in session state
            set(sessionDataState(sessionId), (prevVal) => {
                return (Object.fromEntries(
                    Object.entries(prevVal).map(([k, v]) => [k, [...v, [now, +(data.dataPoints[k] * 100).toFixed()]]])
                ) as unknown) as Data;
            });

            // If this session is recording push the data to the database
            if (snapshot.getLoadable(sessionRecordingState(sessionId)).getValue().status) {
                ipcSend("pushDataPointToSession", {
                    data: data.dataPoints,
                    sessionId: sessionId
                });
            }
        }
    });

    useEffect(() => {
        ipcOn("newData", (event: any, data: DataPayload) => {
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
                <Route path="/create-session" component={CreateSessionView} />
                <Route path="/session" component={SessionView} />
                <Route path="/" component={StartView} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
