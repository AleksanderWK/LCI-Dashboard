import React from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import {useSetRecoilState} from "recoil";
import {selectedSessionIdState} from "../../../state/session";
import {ClassroomIcon} from "../../common/Icons";
import MenuButton from "./MenuButton";

const useStyles = makeStyles(() =>
    createStyles({
        icon: {
            width: "40px",
            height: "40px"
        }
    })
);

interface Props {
    selected: boolean;
}

/**
 * A button for going to the "All sessions" view (i.e., setting the selected session to null)
 * @param {object} props - Component props
 * @param {boolean} props.selected - Whether this button is selected or not
 */
export default function ClassroomButton(props: Props): JSX.Element {
    const classes = useStyles();

    const setSelectedSessionId = useSetRecoilState(selectedSessionIdState);

    return (
        <MenuButton
            selected={props.selected}
            tooltip="All sessions"
            onClick={() => {
                setSelectedSessionId(null);
            }}
        >
            <ClassroomIcon className={classes.icon} />
        </MenuButton>
    );
}
