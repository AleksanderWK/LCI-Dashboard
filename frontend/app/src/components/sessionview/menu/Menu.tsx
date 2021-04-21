import React from "react";
import {createStyles, Fab, makeStyles, Theme, Tooltip} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ClassroomButton from "./ClassroomButton";
import StudentButton from "./StudentButton";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {createSessionPopupOpenState} from "../../../state/popup";
import {selectedSessionIdState, sessionsState} from "../../../state/session";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menu: {
            position: "relative",
            boxSizing: "border-box",
            padding: "30px 0",
            width: "100%",
            height: "100%",
            backgroundColor: "#E6E6E6", // Background of title bar
            overflow: "scroll",
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 1,
            gridRowEnd: 3,
            // Hide scroll bar
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
                display: "none"
            }
        },
        wrapper: {
            display: "grid",
            gridTemplateColumns: "100%",
            gap: "20px"
        },
        hr: {
            margin: "0 auto",
            width: "40px",
            borderRadius: "2px",
            borderBottom: "1px solid #878787"
        },
        tooltip: {
            marginLeft: 10
        },
        addButton: {
            margin: "0 auto"
        },
        addIcon: {
            color: theme.palette.text.default
        }
    })
);

export default function Menu(): JSX.Element {
    const classes = useStyles();

    const setCreateSessionPopupOpen = useSetRecoilState(createSessionPopupOpenState);

    const selectedSessionId = useRecoilValue(selectedSessionIdState);

    const sessions = useRecoilValue(sessionsState);

    return (
        <div className={classes.menu}>
            <div className={classes.wrapper}>
                <ClassroomButton selected={!selectedSessionId} />

                <div className={classes.hr}></div>

                {sessions.map((session) => (
                    <StudentButton
                        key={session._id}
                        sessionId={session._id}
                        selected={session._id === selectedSessionId}
                        studentName={session.studentName}
                    />
                ))}
                <Tooltip
                    title="Create new session"
                    classes={{tooltipPlacementRight: classes.tooltip}}
                    placement="right"
                >
                    <Fab
                        size="small"
                        color="primary"
                        aria-label="create new learning session"
                        className={classes.addButton}
                        onClick={() => {
                            setCreateSessionPopupOpen(true);
                        }}
                    >
                        <AddIcon className={classes.addIcon} />
                    </Fab>
                </Tooltip>
            </div>
        </div>
    );
}
