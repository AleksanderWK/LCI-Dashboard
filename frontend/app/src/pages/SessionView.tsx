import {Suspense} from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import {useRecoilState, useResetRecoilState} from "recoil";
import Menu from "../components/sessionview/Menu/Menu";
import PopupContainer from "../components/common/PopupContainer";
import AddStudent from "../components/createsessionview/AddStudent";
import CreateSession from "../components/createsessionview/CreateSession";
import Dashboard from "../components/dashboard/Dashboard";
import {addStudentPopupOpenState, createSessionPopupOpenState} from "../state/popup";
import {createSessionValuesState} from "../state/createSession";

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

    const resetCreateSessionValues = useResetRecoilState(createSessionValuesState);

    return (
        <>
            <div className={classes.pageContainer}>
                <Menu />
                <div className={classes.header}>header space</div>
                <Dashboard />
            </div>

            <PopupContainer
                open={createSessionPopupOpen || addStudentPopupOpen}
                onClose={(e) => {
                    if (addStudentPopupOpen) {
                        e.preventDefault();
                        setAddStudentPopupOpen(false);
                    } else if (createSessionPopupOpen) {
                        setCreateSessionPopupOpen(false);
                        setTimeout(() => {
                            resetCreateSessionValues();
                        }, 100);
                    }
                }}
            >
                {addStudentPopupOpen ? (
                    <AddStudent />
                ) : (
                    <Suspense fallback={<div>Loading...</div>}>
                        <CreateSession />
                    </Suspense>
                )}
            </PopupContainer>
        </>
    );
}
