import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, Typography, IconButton, Theme} from "@material-ui/core";
import TimerIcon from "@material-ui/icons/Timer";
import RecordingButton from "./RecordingButton";
import {selectedSessionIdState, selectedSessionState} from "../../state/session";
import {useRecoilValue, useSetRecoilState} from "recoil";
import HeaderWrapper from "../common/HeaderWrapper";
import InfoItem from "../common/InfoItem";
import {AddChartIcon, CloseIcon, ExitIcon} from "../common/Icons";
import {selectChartsPopupOpenState, quitSessionPopupOpenState} from "../../state/popup";
import {StyledTooltipBottom} from "../common/Tooltips";
import Tooltip from "../common/Tooltip";
import {MMDVariables} from "../../constants";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import {duration} from "../../utils/duration";
import {selectedAllSessionVariableState} from "../../state/allSessions";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        indicatorContainer: {
            display: "grid",
            gridTemplateColumns: "8px max-content",
            gap: theme.spacing(1)
        },
        indicatorIcon: {
            alignSelf: "center",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#7BAF62"
        },
        iconButton: {
            padding: 0
        },
        infoIcon: {
            cursor: "default"
        }
    })
);

export default function Header(): JSX.Element {
    const classes = useStyles();

    const setSelectChartsPopupOpen = useSetRecoilState(selectChartsPopupOpenState);
    const setQuitSessionPopupOpen = useSetRecoilState(quitSessionPopupOpenState);
    const selectedSession = useRecoilValue(selectedSessionIdState);
    const allSessionVariable = useRecoilValue(selectedAllSessionVariableState);

    const selectedSessionInfo = useRecoilValue(selectedSessionState);
    const [dur, setDuration] = useState<string>("");

    useEffect(() => {
        // Set the current duration initially when the compnent loads
        if (selectedSessionInfo) {
            setDuration(duration(selectedSessionInfo.startTime, undefined, 1));
        }

        // Interval that updates the duration state every second
        let intervalId: NodeJS.Timeout | null = null;
        intervalId = setInterval(() => {
            if (selectedSessionInfo) {
                setDuration(duration(selectedSessionInfo.startTime, undefined, 1));
            }
        }, 1000);

        return function cleanup() {
            if (intervalId) clearInterval(intervalId);
        };
    }, [selectedSessionInfo]);

    return (
        <>
            <HeaderWrapper
                title={
                    selectedSession != null && selectedSessionInfo ? selectedSessionInfo.sessionName : "All Sessions"
                }
                infoBar={
                    selectedSession != null && selectedSessionInfo ? (
                        <>
                            <div className={classes.indicatorContainer}>
                                <div className={classes.indicatorIcon}></div>

                                <Typography>{selectedSessionInfo.student.name}</Typography>
                            </div>
                            <InfoItem icon={<TimerIcon />} text={dur} />
                        </>
                    ) : (
                        <div
                            className={classes.indicatorContainer}
                            style={{gridTemplateColumns: "20px max-content", gridTemplateRows: "24px"}}
                        >
                            {allSessionVariable && (
                                <>
                                    <Tooltip variable={allSessionVariable}>
                                        <IconButton
                                            aria-label="info"
                                            disableFocusRipple={true}
                                            disableRipple={true}
                                            disableTouchRipple={true}
                                            className={`${classes.iconButton} ${classes.infoIcon}`}
                                        >
                                            <InfoOutlinedIcon color="action" />
                                        </IconButton>
                                    </Tooltip>

                                    <Typography>{MMDVariables[allSessionVariable].name}</Typography>
                                </>
                            )}
                        </div>
                    )
                }
                buttonGroup={
                    <>
                        {selectedSession != null ? <RecordingButton /> : <></>}

                        <StyledTooltipBottom title="Select views">
                            <IconButton
                                aria-label="select views"
                                onClick={() => {
                                    setSelectChartsPopupOpen(true);
                                }}
                            >
                                <AddChartIcon />
                            </IconButton>
                        </StyledTooltipBottom>
                        {selectedSession == null ? (
                            <StyledTooltipBottom title="Exit">
                                <IconButton
                                    aria-label="Exit"
                                    onClick={() => {
                                        setQuitSessionPopupOpen(true);
                                    }}
                                >
                                    <ExitIcon />
                                </IconButton>
                            </StyledTooltipBottom>
                        ) : (
                            <StyledTooltipBottom title="Quit session">
                                <IconButton
                                    aria-label="quit student session"
                                    onClick={() => {
                                        setQuitSessionPopupOpen(true);
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </StyledTooltipBottom>
                        )}
                    </>
                }
            />
        </>
    );
}
