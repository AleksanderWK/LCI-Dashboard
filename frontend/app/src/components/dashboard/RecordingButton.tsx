import React from "react";
import Button from "@material-ui/core/Button";
//import {makeStyles, Theme, createStyles, Icon} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

/*const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {}
    })
);
*/

export default function RecordingButton(): JSX.Element {
    //const classes = useStyles();

    return (
        <Button variant="contained" color="primary" startIcon={<PlayArrowIcon />}>
            Start recording
        </Button>
    );
}
