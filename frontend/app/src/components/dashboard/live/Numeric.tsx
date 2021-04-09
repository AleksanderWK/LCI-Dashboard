import React from "react";
import {createStyles, makeStyles, Theme, Typography} from "@material-ui/core";
import {useRecoilValue} from "recoil";
import {Variable} from "../../../constants";
import {selectedSessionLastValueState, sessionVariableDataState} from "../../../state/session";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        numericWrapper: {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        numeric: {
            fontSize: 50,
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
    id?: number;
}

function Numeric(props: Props): JSX.Element {
    const classes = useStyles();
    const dataPoint = !props.id
        ? useRecoilValue(selectedSessionLastValueState(props.variable))
        : useRecoilValue(sessionVariableDataState([props.variable, props.id])).slice(-1)[0];

    return (
        <div className={classes.numericWrapper}>
            {dataPoint ? (
                <Typography className={classes.numeric}>{dataPoint}</Typography>
            ) : (
                <Typography className={classes.noData}>No data received</Typography>
            )}
        </div>
    );
}

export default Numeric;
