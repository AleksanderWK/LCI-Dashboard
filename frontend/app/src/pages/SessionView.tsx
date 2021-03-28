import React from "react";
import {Snackbar} from "@material-ui/core";
import {useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import Menu from "../components/sessionview/Menu/Menu";
import PopupContainer from "../components/common/PopupContainer";
import AddStudent from "../components/createsessionview/AddStudent";
import CreateSession from "../components/createsessionview/CreateSession";
import Dashboard from "../components/dashboard/live/Dashboard";
import {
    addStudentPopupOpenState,
    createSessionPopupOpenState,
    selectChartsPopupOpenState,
    quitSessionPopupOpenState
} from "../state/popup";
import {createSessionValuesState} from "../state/createSession";
import Header from "../components/sessionview/Header";
import SelectCharts from "../components/sessionview/SelectCharts";
import QuitSession from "../components/sessionview/QuitSession";
import Popup from "../components/common/Popup";
import {Alert} from "@material-ui/lab";
import {snackOpenState} from "../state/session";
import PageContainer from "../components/common/PageContainer";

export default function SessionView(): JSX.Element {
    const [addStudentPopupOpen, setAddStudentPopupOpen] = useRecoilState(addStudentPopupOpenState);
    const [createSessionPopupOpen, setCreateSessionPopupOpen] = useRecoilState(createSessionPopupOpenState);
    const [selectChartsPopupOpen, setSelectChartsPopupOpen] = useRecoilState(selectChartsPopupOpenState);
    const [quitSessionPopupOpen, setQuitSessionPopupOpen] = useRecoilState(quitSessionPopupOpenState);

    const resetCreateSessionValues = useResetRecoilState(createSessionValuesState);

    const snackOpen = useRecoilValue(snackOpenState);
    return (
        <>
            <PageContainer menu={<Menu />}>
                <>
                    <Header />
                    <Dashboard />
                </>
            </PageContainer>

            <PopupContainer
                open={createSessionPopupOpen || addStudentPopupOpen || selectChartsPopupOpen || quitSessionPopupOpen}
                onClose={(e) => {
                    if (addStudentPopupOpen) {
                        e.preventDefault();
                        setAddStudentPopupOpen(false);
                    } else if (createSessionPopupOpen) {
                        setCreateSessionPopupOpen(false);
                        setTimeout(() => {
                            resetCreateSessionValues();
                        }, 100);
                    } else if (selectChartsPopupOpen) {
                        setSelectChartsPopupOpen(false);
                    } else if (quitSessionPopupOpen) {
                        setQuitSessionPopupOpen(false);
                    }
                }}
            >
                <>
                    {quitSessionPopupOpen ? (
                        <Popup>
                            <QuitSession />
                        </Popup>
                    ) : selectChartsPopupOpen ? (
                        <Popup>
                            <SelectCharts />
                        </Popup>
                    ) : addStudentPopupOpen ? (
                        <Popup>
                            <AddStudent />
                        </Popup>
                    ) : createSessionPopupOpen ? (
                        <Popup>
                            <CreateSession />
                        </Popup>
                    ) : null}
                </>
            </PopupContainer>
            <Snackbar open={snackOpen} anchorOrigin={{vertical: "bottom", horizontal: "right"}} style={{zIndex: 2}}>
                <Alert severity="success">Recording has been saved</Alert>
            </Snackbar>
        </>
    );
}
