import React from "react";
import ReactDOM from "react-dom";
import {fireEvent, render, screen} from "@testing-library/react";
import AddStudent from "../AddStudent";
import {RecoilRoot} from "recoil";
import CreateSessionView from "../../../pages/CreateSessionView";
import {addStudentPopupOpenState} from "../../../state/popup";
import {studentsState} from "../../../state/student";
import {createMemoryHistory} from "history";
import {Router} from "react-router-dom";

const history = createMemoryHistory();
history.push("/create-session");

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(addStudentPopupOpenState, true);
            }}
        >
            <AddStudent />
        </RecoilRoot>,
        div
    );
});

it("AddStudentPopup matches snapshot", () => {
    const {baseElement} = render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(addStudentPopupOpenState, true);
            }}
        >
            <AddStudent />
        </RecoilRoot>
    );
    expect(baseElement).toMatchSnapshot();
});

it("cant add empty string", async () => {
    render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(addStudentPopupOpenState, true);
            }}
        >
            <AddStudent />
        </RecoilRoot>
    );
    const nameField = screen.getByRole("textbox", {hidden: true});
    const submitBtn = screen.getByRole("button", {
        name: /add student/i,
        hidden: true
    });
    await fireEvent.click(submitBtn);
    expect(nameField.parentElement).toHaveClass("Mui-error");
});

it("cant add same student twice", async () => {
    render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(addStudentPopupOpenState, true);
                snap.set(studentsState, [{_id: "1", name: "Aleksander"}]);
            }}
        >
            <Router history={history}>
                <CreateSessionView />
            </Router>
        </RecoilRoot>
    );
    const nameField = screen.getByTestId("content-input");
    const submitBtn = screen.getByRole("button", {
        name: /add student/i,
        hidden: true
    });
    const popupBtn = screen.getByRole("button", {name: /add new student/i});
    await fireEvent.click(popupBtn);
    await fireEvent.change(nameField, {target: {value: "Aleksander"}});
    await fireEvent.click(submitBtn);
    expect(nameField.parentElement).toHaveClass("Mui-error");
});

/*
it("popup adds student to selection dropdown", async () => {
    render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(popupOpen, true);
            }}
        >
            <CreateSessionView />
        </RecoilRoot>
    );
    const nameField = screen.getByTestId("content-input");
    const submitBtn = screen.getByRole("button", {
        name: /add student/i,
        hidden: true
    });
    const dropdownField = screen.getByLabelText("Student");
    await fireEvent.change(nameField, {target: {value: "Aleksander"}});
    await fireEvent.click(submitBtn);
    await fireEvent.click(dropdownField);
    expect(screen.getByTestId("Aleksander")).not.toThrowError();
});
//test: popup adds student to selection dropdown (expect option to be in document)
*/
