import {createStyles, makeStyles, Typography} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import {useSetRecoilState} from "recoil";
import {selectedSessionIdState} from "../../../state/session";
import MenuButton from "./MenuButton";

const useStyles = makeStyles(() =>
    createStyles({
        initialsContainer: {
            position: "absolute",
            bottom: 11
        },
        initials: {
            fontSize: 10,
            color: "white"
        },
        icon: {
            width: "50px",
            height: "50px"
        },
        recordingLabelContainer: {
            position: "absolute",
            bottom: 4,
            right: 12,
            backgroundColor: "#DD5757",
            borderRadius: 4,
            padding: "2px 4px 1px 4px"
        },
        recordingLabel: {
            color: "white",
            fontSize: 8
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
    return (
        <div className={classes.recordingLabelContainer}>
            <Typography className={classes.recordingLabel}>REC</Typography>
        </div>
    );
}
