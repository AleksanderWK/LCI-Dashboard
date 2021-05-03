import React from "react";
import {makeStyles, createStyles} from "@material-ui/core";
import dashboardIllustration from "../assets/images/dashboardIllustration.svg";
import CreateSession from "../components/createsessionview/CreateSession";
import PopupContainer from "../components/common/PopupContainer";
import AddStudent from "../components/createsessionview/AddStudent";
import {useRecoilState} from "recoil";
import {addStudentPopupOpenState} from "../state/popup";
import Popup from "../components/common/Popup";
import PageContainer from "../components/common/PageContainer";
import Logo from "../components/common/Logo";

const useStyles = makeStyles(() =>
    createStyles({
        content: {
            height: "100%",
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            padding: "0 97px",
            margin: "auto"
        },
        illustration: {
            width: "400px",
            height: "400px",
            marginLeft: "100px"
        }
    })
);

/**
 *  The view for creating a session from the start view.
 *  Renders the create session form and add student popup.
 */
export default function CreateSessionView(): JSX.Element {
    const classes = useStyles();

    const [addStudentPopupOpen, setAddStudentPopupOpen] = useRecoilState(addStudentPopupOpenState);

    return (
        <>
            <PageContainer>
                <>
                    <Logo absolute />
                    <div className={classes.content}>
                        <CreateSession />
                        <img
                            className={classes.illustration}
                            src={dashboardIllustration}
                            alt="dashboard illustration"
                        />
                    </div>
                </>
            </PageContainer>

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
