import {createStyles, makeStyles, Typography, IconButton, SvgIcon, SvgIconProps, Theme} from "@material-ui/core";
import logo from "../../assets/Images/LCI_logo.png";
import TimerIcon from "@material-ui/icons/Timer";
import RecordingButton from "./RecordingButton";
import {selectedSessionState} from "../../state/session";
import {useRecoilValue} from "recoil";
import {useEffect, useState} from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },

        sessionInfoContainer: {
            marginLeft: "25px",
            height: "60px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "355px"
        },

        indicatorIcon: {
            width: "7.5px",
            height: "7.5px",
            borderRadius: "7.5px",
            backgroundColor: "#7BAF62"
        },

        btnGroup: {
            display: "grid",
            gridTemplateColumns: "225px 50px 50px",
            gridTemplateRows: "35px",
            gap: theme.spacing(2),
            marginRight: "40px"
        },
        contentLeft: {
            marginLeft: "40px",
            display: "flex",
            alignItems: "center"
        },
        textColor: {
            color: theme.palette.text.default
        },
        infoRow: {
            display: "grid",
            gridTemplateColumns: "30px max-content 30px 30px max-content",
            gridTemplateRows: "30px",
            alignItems: "center",
            justifyItems: "center"
        },
        header: {
            width: "auto"
        }
    })
);

function AddChartIcon(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props}>
            <path
                d="M29 4.5V7.5H24.5V12H21.5V7.5H17V4.5H21.5V0H24.5V4.5H29ZM24.5 25.5H3.5V4.5H12.5V1.5H3.5C1.85 1.5 0.5 2.85 0.5 4.5V25.5C0.5 27.15 1.85 28.5 3.5 28.5H24.5C26.15 28.5 27.5 27.15 27.5 25.5V16.5H24.5V25.5ZM18.5 16.5V22.5H21.5V16.5H18.5ZM12.5 22.5H15.5V10.5H12.5V22.5ZM9.5 22.5V13.5H6.5V22.5H9.5Z"
                fill="#535353"
            />
        </SvgIcon>
    );
}
function CloseIcon(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props}>
            <path
                d="M17.9408 8.55L14.25 12.2408L10.5592 8.55L8.55 10.5592L12.2408 14.25L8.55 17.9408L10.5592 19.95L14.25 16.2592L17.9408 19.95L19.95 17.9408L16.2592 14.25L19.95 10.5592L17.9408 8.55ZM14.25 0C6.36975 0 0 6.36975 0 14.25C0 22.1302 6.36975 28.5 14.25 28.5C22.1302 28.5 28.5 22.1302 28.5 14.25C28.5 6.36975 22.1302 0 14.25 0ZM14.25 25.65C7.96575 25.65 2.85 20.5343 2.85 14.25C2.85 7.96575 7.96575 2.85 14.25 2.85C20.5343 2.85 25.65 7.96575 25.65 14.25C25.65 20.5343 20.5343 25.65 14.25 25.65Z"
                fill="#535353"
            />
        </SvgIcon>
    );
}

export default function Header(): JSX.Element {
    const classes = useStyles();

    const selectedSessionInfo = useRecoilValue(selectedSessionState);
    const [duration, setDuration] = useState<string>();

    useEffect(() => {
        //interval that updates the duration state every second
        if (selectedSessionInfo) {
            setInterval(() => {
                const d = new Date().getTime();
                let distance = d - selectedSessionInfo.startTime.getTime();
                const hours = Math.floor(distance / 3600000);
                distance -= hours * 3600000;
                const minutes = Math.floor(distance / 60000);
                distance -= minutes * 60000;
                const seconds = Math.floor(distance / 1000);
                setDuration(`${hours}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`);
            }, 1000);
        }
    }, []);

    return (
        <div className={classes.container}>
            <div className={classes.contentLeft}>
                <img src={logo} alt="The LCI logo" />

                <div className={classes.sessionInfoContainer}>
                    <Typography variant={"h1"} noWrap className={classes.header}>
                        {selectedSessionInfo?.sessionName}
                    </Typography>

                    <div className={`${classes.infoRow}`}>
                        <div className={classes.indicatorIcon}></div>
                        <Typography>{selectedSessionInfo?.student.name}</Typography>
                        <div></div>
                        <TimerIcon className={classes.textColor} />

                        <Typography>{duration}</Typography>
                    </div>
                </div>
            </div>
            <div className={classes.btnGroup}>
                <RecordingButton />
                <IconButton aria-label="add new chart">
                    <AddChartIcon
                        width="29"
                        height="29"
                        viewBox="0 0 29 29"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    />
                </IconButton>
                <IconButton aria-label="quit student session">
                    <CloseIcon
                        width="29"
                        height="29"
                        viewBox="0 0 29 29"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    />
                </IconButton>
            </div>
        </div>
    );
}
