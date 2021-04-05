import React from "react";
import {createStyles, makeStyles, Theme, Typography} from "@material-ui/core";
import {useRecoilValue} from "recoil";
import {Variable} from "../../../constants";
import {selectedSessionLastValueState} from "../../../state/session";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        numericWrapper: {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none"
        },
        numeric: {
            fontSize: 70,
            color: theme.palette.text.default,
            textAlign: "center"
        },
        noData: {
            color: theme.palette.text.default,
            textAlign: "center"
        }
    })
);

interface Props {
    variable: Variable;
}

function Numeric(props: Props): JSX.Element {
    const classes = useStyles();

    // Get the latest variable data point for the selected user
    const dataPoint = useRecoilValue(selectedSessionLastValueState(props.variable));

    return (
        <div className={`${"noDrag"} ${classes.numericWrapper}`}>
            {dataPoint ? (
                <Typography className={classes.numeric}>{Math.round(dataPoint)}</Typography>
            ) : (
                <Typography className={classes.noData}>No data received</Typography>
            )}
        </div>
    );
}

export default Numeric;
