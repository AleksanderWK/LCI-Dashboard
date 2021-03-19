import {createStyles, makeStyles, Typography, IconButton, SvgIcon, SvgIconProps, Theme} from "@material-ui/core";
import logo from "../../assets/Images/LCI_logo.png";
import TimerIcon from "@material-ui/icons/Timer";
import IntervalSlider from "./IntervalSlider";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import EventIcon from "@material-ui/icons/Event";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";

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
            width: "490px"
        },

        indicatorIcon: {
            width: "7.5px",
            height: "7.5px",
            borderRadius: "7.5px",
            backgroundColor: "#7BAF62"
        },

        btnGroup: {
            display: "grid",
            gridTemplateColumns: "320px 50px 50px",
            gridTemplateRows: "50px",
            alignItems: "center",
            gap: theme.spacing(1),
            marginRight: "30px"
        },
        contentLeft: {
            marginLeft: "30px",
            display: "flex",
            alignItems: "center"
        },
        textColor: {
            color: theme.palette.text.default
        },
        infoRow: {
            display: "grid",
            gridTemplateColumns: "30px max-content 30px 30px max-content 30px 30px max-content 30px 30px max-content",
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

function ExitIcon(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props}>
            <path
                d="M15.135 23.385L17.25 25.5L24.75 18L17.25 10.5L15.135 12.615L19.005 16.5H4.5V19.5H19.005L15.135 23.385ZM28.5 4.5H7.5C5.835 4.5 4.5 5.85 4.5 7.5V13.5H7.5V7.5H28.5V28.5H7.5V22.5H4.5V28.5C4.5 30.15 5.835 31.5 7.5 31.5H28.5C30.15 31.5 31.5 30.15 31.5 28.5V7.5C31.5 5.85 30.15 4.5 28.5 4.5Z"
                fill="#535353"
            />
        </SvgIcon>
    );
}
export default function Header(): JSX.Element {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.contentLeft}>
                <img src={logo} alt="The LCI logo" />

                <div className={classes.sessionInfoContainer}>
                    <Typography variant={"h1"} noWrap className={classes.header}>
                        Educational Game
                    </Typography>

                    <div className={`${classes.infoRow}`}>
                        <PersonIcon className={classes.textColor} />
                        <Typography>Aleksander</Typography>
                        <div></div>
                        <EventIcon className={classes.textColor} />
                        <Typography>Feb 12. 2021</Typography>
                        <div></div>
                        <QueryBuilderIcon className={classes.textColor} />
                        <Typography>09:00</Typography>
                        <div></div>
                        <TimerIcon className={classes.textColor} />
                        <Typography>1h 0m 0s</Typography>
                    </div>
                </div>
            </div>
            <div className={classes.btnGroup}>
                <IntervalSlider />
                <IconButton aria-label="add new chart">
                    <AddChartIcon viewBox="0 0 29 29" />
                </IconButton>
                <IconButton
                    aria-label="quit student session"
                    onClick={() => {
                        //history.push("/StartView")
                    }}
                >
                    <ExitIcon viewBox="3 3 29 29" />
                </IconButton>
            </div>
        </div>
    );
}
