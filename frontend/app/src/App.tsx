/*
 *  The entry point of the application.
 */

import {BrowserRouter, Route, Switch} from "react-router-dom";
import SessionView from "./pages/SessionView";
import CreateSessionView from "./pages/CreateSessionView";
import {useEffect} from "react";
import {ipcSend} from "./ipc";
import StartView from "./pages/StartView";
import RecordedSessionView from "./pages/RecordedSessionView";

function App(): JSX.Element {
    // When loaded, start the WebSocket server
    useEffect(() => {
        ipcSend("startServer", true);
    }, []);

    // Returns a router which handles all views
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/recording" component={RecordedSessionView} />
                <Route path="/create-session" component={CreateSessionView} />
                <Route path="/session" component={SessionView} />
                <Route path="/" component={StartView} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
