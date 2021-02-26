import React from "react";
import "./App.css";
import Container from "./components/dashboard/Container";
import {Variable} from "./constants";

function App(): JSX.Element {
    return (
        <div className="App">
            <Container variable={Variable.PerceivedDifficulty}></Container>
        </div>
    );
}

export default App;
