import React, {Suspense} from "react";
import {makeStyles, createStyles} from "@material-ui/core";
import logo from "../assets/Images/LCI_logo.png";
import dashboardIllustration from "../assets/Images/dashboardIllustration.svg";
import CreateSession from "../components/createsessionview/CreateSession";
import PopupContainer from "../components/common/PopupContainer";
import AddStudent from "../components/createsessionview/AddStudent";
import {useRecoilState} from "recoil";
import {addStudentPopupOpenState} from "../state/popup";
import Popup from "../components/common/Popup";

const useStyles = makeStyles(() =>
    createStyles({
        pageContainer: {
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "30px 140px auto 140px 30px",
            gridTemplateRows: "30px auto 30px"
        },
        pageLogo: {
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 2,
            gridRowEnd: 3
        },
        pageContent: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            gridColumnStart: 3,
            gridColumnEnd: 4,
            gridRowStart: 2,
            gridRowEnd: 3
        },
        illustration: {
            width: "400px",
            height: "400px",
            marginLeft: "100px"
        }
    })
);

export default function CreateSessionView(): JSX.Element {
    const classes = useStyles();

    const [addStudentPopupOpen, setAddStudentPopupOpen] = useRecoilState(addStudentPopupOpenState);

    return (
        <>
            <div className={classes.pageContainer}>
                <img className={classes.pageLogo} src={logo} alt="The LCI-lab logo" />
                <div className={classes.pageContent}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <CreateSession />
                    </Suspense>
                    <img className={classes.illustration} src={dashboardIllustration} alt="dashboard illustration" />
                </div>
            </div>

            <PopupContainer
                open={addStudentPopupOpen}
                onClose={() => {
                    setAddStudentPopupOpen(false);
                }}
            >
                <Popup>
                    <AddStudent />
                </Popup>
            </PopupContainer>
        </>
    );
}
