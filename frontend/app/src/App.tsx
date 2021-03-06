import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import SessionView from "./pages/SessionView";
import StartView from "./pages/StartView";
import CreateSessionView from "./pages/CreateSessionView";

function App(): JSX.Element {
    /*useEffect(() => {
        const electron = window.require("electron");
        const ipc = electron.ipcRenderer;

        ipc.on("newData", (event: any, data: any) => {
            console.log(data);
        });

        ipc.send("readyConnection", true);
    }, []);
*/
    return (
        <BrowserRouter>
            <Switch>
                {/*
                    Add new pages by adding a Route component. (Important! they need to be above the startview route) Use the Link component from react-router-dom in other compoenents to navigate to Routes specified here. 
                */}
                <Route path="/create-session" component={CreateSessionView} />
                <Route path="/session" component={SessionView} />
                <Route path="/" component={SessionView} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
