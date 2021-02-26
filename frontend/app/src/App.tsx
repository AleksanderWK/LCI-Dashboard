import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import "./App.css";
import StartView from "./StartView";

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <div className="App">
                <div className="content">
                    <Switch>
                        {/*
                        Add ned pages by adding a Route component. (Important! they need to be above the startview route)
                        Use the Link component from react-router-dom in other compoenents to navigate to Routes specified here. 
                        */}
                        <Route path="/" component={StartView} />
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
