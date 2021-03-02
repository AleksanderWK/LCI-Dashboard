import react, {useState} from "react";
import {makeStyles, createStyles, Theme, Grid} from "@material-ui/core";
import logo from "../assets/Images/LCI_logo.png";
import dashboardIllustration from "../assets/Images/dashboardIllustration.svg";
import CreateSession from "../components/dashboard/CreateSession";
import AddStudentPopup from "../components/dashboard/AddStudentPopup";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pageContainer: {
            width: "100%",
            height: window.innerHeight,
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

    const [popupOpen, togglePopup] = useState<boolean>(true);

    return (
        <div className={classes.pageContainer}>
            <img className={classes.pageLogo} src={logo} alt="The LCI-lab logo" />
            <div className={classes.pageContent}>
                <AddStudentPopup
                    open={popupOpen}
                    handlePopupClose={() => {
                        togglePopup(false);
                    }}
                />
                <CreateSession
                    handleTogglePopup={(open) => {
                        togglePopup(open);
                    }}
                />
                <img className={classes.illustration} src={dashboardIllustration} alt="dashboard illustration" />
            </div>
        </div>
    );
}
