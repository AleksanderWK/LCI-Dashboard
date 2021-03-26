import React, {useEffect} from "react";
import {createStyles, makeStyles, Snackbar} from "@material-ui/core";
import {useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import Menu from "../components/sessionview/Menu/Menu";
import PopupContainer from "../components/common/PopupContainer";
import AddStudent from "../components/createsessionview/AddStudent";
import CreateSession from "../components/createsessionview/CreateSession";
import Dashboard from "../components/dashboard/live/Dashboard";
import {addStudentPopupOpenState, createSessionPopupOpenState, quitSessionPopupOpenState} from "../state/popup";
import {createSessionValuesState} from "../state/createSession";
import Header from "../components/sessionview/Header";
import QuitSession from "../components/sessionview/QuitSession";
import Popup from "../components/common/Popup";
import {Alert} from "@material-ui/lab";
import zIndex from "@material-ui/core/styles/zIndex";
import {selectedSessionRecordingState, snackOpenState} from "../state/session";

const useStyles = makeStyles(() =>
    createStyles({
        pageContainer: {
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "100px auto",
            gridTemplateRows: "125px auto"
        },
        header: {
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 1,
            gridRowEnd: 2
        }
    })
);

export default function SessionView(): JSX.Element {
    const classes = useStyles();

    const [addStudentPopupOpen, setAddStudentPopupOpen] = useRecoilState(addStudentPopupOpenState);
    const [createSessionPopupOpen, setCreateSessionPopupOpen] = useRecoilState(createSessionPopupOpenState);
    const [quitSessionPopupOpen, setQuitSessionPopupOpen] = useRecoilState(quitSessionPopupOpenState);

    const resetCreateSessionValues = useResetRecoilState(createSessionValuesState);

    const snackOpen = useRecoilValue(snackOpenState);
    return (
        <>
            <div className={classes.pageContainer}>
                <Menu />
                <Header />
                <Dashboard />
            </div>

            <PopupContainer
                open={createSessionPopupOpen || addStudentPopupOpen || quitSessionPopupOpen}
                onClose={(e) => {
                    if (addStudentPopupOpen) {
                        e.preventDefault();
                        setAddStudentPopupOpen(false);
                    } else if (createSessionPopupOpen) {
                        setCreateSessionPopupOpen(false);
                        setTimeout(() => {
                            resetCreateSessionValues();
                        }, 100);
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
