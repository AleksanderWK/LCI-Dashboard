import {BrowserRouter, Route, Switch} from "react-router-dom";
import SessionView from "./pages/SessionView";
import CreateSessionView from "./pages/CreateSessionView";
import {useEffect} from "react";
import {ipcOn, ipcSend} from "./ipc";
import {Data, sessionDataState} from "./state/session";
import {useRecoilCallback} from "recoil";
import {Variable} from "./constants";

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
    const addDataPointToState = useRecoilCallback(({set}) => (sessionId: number | null, dataPoints: DataPoints) => {
        const now = new Date().getTime();

        set(sessionDataState(sessionId), (prevVal) => {
            return (Object.fromEntries(
                Object.entries(prevVal).map(([k, v]) => [k, [...v, [now, +(dataPoints[k] * 100).toFixed()]]])
            ) as unknown) as Data;
        });
    });

    useEffect(() => {
        ipcOn("newData", (event: any, data: DataPoints) => {
            addDataPointToState(1, data);
        });

        ipcSend("startServer", true);
    }, []);

    return (
        <BrowserRouter>
            <Switch>
                {/*
                    Add new pages by adding a Route component. (Important! they need to be above the startview route) Use the Link component from react-router-dom in other compoenents to navigate to Routes specified here. 
                */}
                <Route path="/session" component={SessionView} />
                <Route path="/" component={CreateSessionView} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
