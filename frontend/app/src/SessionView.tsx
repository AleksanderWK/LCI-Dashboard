import React from "react";
import Container from "./components/dashboard/Container";
import {Variable} from "./constants";

export default function SessionView(): JSX.Element {
    return (
        <div>
            <Container variable={Variable.CognitiveLoad} />
        </div>
    );
}
