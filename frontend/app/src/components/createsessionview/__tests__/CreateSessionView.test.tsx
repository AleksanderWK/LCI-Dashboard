import React from "react";
import ReactDOM from "react-dom";
import {render} from "@testing-library/react";
import CreateSessionView from "../../../pages/CreateSessionView";
import {createMemoryHistory} from "history";
import {Router} from "react-router-dom";
import {RecoilRoot} from "recoil";

const history = createMemoryHistory();
history.push("/create-session");

it("create session view matches snapshot", () => {
    const {baseElement} = render(
        <RecoilRoot>
            <Router history={history}>
                <CreateSessionView />
            </Router>
        </RecoilRoot>
    );
    expect(baseElement).toMatchSnapshot();
});

it("renders without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
        <RecoilRoot>
            <Router history={history}>
                <CreateSessionView />
            </Router>
        </RecoilRoot>,
        div
    );
});
