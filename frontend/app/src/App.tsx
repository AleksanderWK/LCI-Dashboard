import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import "./App.css";
import SessionView from "./pages/SessionView";
import StartView from "./pages/StartView";
import CreateSessionView from "./pages/CreateSessionView";
import {useEffect} from "react";
import ipc from "./ipc";

function App(): JSX.Element {
    useEffect(() => {
        ipc.on("newData", (event: any, data: any) => {
            console.log(data);
        });

        ipc.send("readyConnection", true);
    }, []);

    return (
        <BrowserRouter>
            <div className="App">
                <div className="content">
                    <Switch>
                        {/*
                        Add ned pages by adding a Route component. (Important! they need to be above the startview route)
                        Use the Link component from react-router-dom in other compoenents to navigate to Routes specified here. 
                        */}
                        <Route path="/session" component={SessionView} />
                        <Route path="/" component={CreateSessionView} />
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
