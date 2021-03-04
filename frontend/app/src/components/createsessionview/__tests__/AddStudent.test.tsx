import React from "react";
import ReactDOM from "react-dom";
import {fireEvent, render, screen, waitFor, getByTestId} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddStudentPopup from "../AddStudentPopup";
import {RecoilRoot} from "recoil";
import {popupOpen} from "../../../state/CreateSessionViewState/createSessionViewAtoms";
import CreateSessionView from "../../../pages/CreateSessionView";

it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(popupOpen, true);
            }}
        >
            <AddStudentPopup />
        </RecoilRoot>,
        div
    );
});

it("AddStudentPopup matches snapshot", () => {
    const {baseElement} = render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(popupOpen, true);
            }}
        >
            <AddStudentPopup />
        </RecoilRoot>
    );
    expect(baseElement).toMatchSnapshot();
});

it("cant add empty string", async () => {
    render(
        <RecoilRoot
            initializeState={(snap) => {
                snap.set(popupOpen, true);
            }}
        >
            <AddStudentPopup />
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
    const popupBtn = screen.getByRole("button", {name: /add new student/i});
    await fireEvent.change(nameField, {target: {value: "Aleksander"}});
    await fireEvent.click(submitBtn);
    await fireEvent.click(popupBtn);
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
