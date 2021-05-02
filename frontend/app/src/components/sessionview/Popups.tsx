import {useRecoilState, useResetRecoilState} from "recoil";
import {
    addStudentPopupOpenState,
    createSessionPopupOpenState,
    quitSessionPopupOpenState,
    selectChartsPopupOpenState
} from "../../state/popup";
import {createSessionValuesState} from "../../state/createSession";
import Popup from "../common/Popup";
import PopupContainer from "../common/PopupContainer";
import AddStudent from "../createsessionview/AddStudent";
import CreateSession from "../createsessionview/CreateSession";
import QuitSession from "./QuitSession";
import SelectCharts from "./SelectCharts";

/**
 * Popups shown in SessionView, including QuitSession, SelectCharts, CreateSession and AddStudent.
 */
export default function Popups(): JSX.Element {
    const [addStudentPopupOpen, setAddStudentPopupOpen] = useRecoilState(addStudentPopupOpenState);
    const [createSessionPopupOpen, setCreateSessionPopupOpen] = useRecoilState(createSessionPopupOpenState);
    const [selectChartsPopupOpen, setSelectChartsPopupOpen] = useRecoilState(selectChartsPopupOpenState);
    const [quitSessionPopupOpen, setQuitSessionPopupOpen] = useRecoilState(quitSessionPopupOpenState);

    const resetCreateSessionValues = useResetRecoilState(createSessionValuesState);

    return (
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
    );
}
