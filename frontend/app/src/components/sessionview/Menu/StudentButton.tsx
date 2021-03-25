import {createStyles, makeStyles, Typography} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import {useSetRecoilState} from "recoil";
import {selectedSessionIdState} from "../../../state/session";
import MenuButton from "./MenuButton";
import clsx from "clsx";

const useStyles = makeStyles(() =>
    createStyles({
        initialsContainer: {
            position: "absolute",
            bottom: 11
        },
        initials: {
            fontSize: 10,
            marginLeft: 2,
            color: "white"
        },
        icon: {
            marginLeft: 2,
            width: "50px",
            height: "50px"
        },
        recordingLabelContainer: {
            position: "absolute",
            bottom: 4,
            right: 20,
            width: "15px",
            height: "15px",
            backgroundColor: "rgba(221, 87, 87, 1)",
            borderRadius: "50%",
            boxShadow: "0 0 0 0 rgba(221, 87, 87, 1)",
            transform: "scale(1)",
            animation: "$pulse 2s infinite"
        },
        recordingLabel: {
            color: "white",
            fontSize: 8
        },
        "@keyframes pulse": {
            "0%": {
                transform: "scale(0.95)",
                boxShadow: "0 0 0 0 rgba(221, 87, 87, 0.7)"
            },
            "70%": {
                transform: "scale(1)",
                boxShadow: "0 0 0 7.5px rgba(221, 87, 87, 0)"
            },

            "100%": {
                transform: "scale(0.95)",
                boxShadow: "0 0 0 0 rgba(221, 87, 87, 0)"
            }
        }
    })
);

interface Props {
    sessionId: number;
    selected: boolean;
    studentName: string;
    recording: boolean;
}

export default function StudentButton(props: Props): JSX.Element {
    const classes = useStyles();

    const setSelectedSessionId = useSetRecoilState(selectedSessionIdState);

    const getInitials = (name: string) => {
        const names = name.split(" ");
        let initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
    };

    return (
        <MenuButton
            selected={props.selected}
            tooltip={props.studentName}
            onClick={() => {
                if (!props.selected) {
                    setSelectedSessionId(props.sessionId);
                }
            }}
        >
            <>
                <div className={classes.initialsContainer}>
                    <Typography className={classes.initials}>{getInitials(props.studentName)}</Typography>
                </div>
                <PersonIcon className={classes.icon} />
                {props.recording && <RecordingLabel />}
            </>
        </MenuButton>
    );
}

function RecordingLabel() {
    const classes = useStyles();
    return <div className={classes.recordingLabelContainer}></div>;
}
