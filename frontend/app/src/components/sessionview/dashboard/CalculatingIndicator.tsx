import React, {useEffect, useState} from "react";
import {createStyles, LinearProgress, makeStyles, Theme, Typography} from "@material-ui/core";
import {MMDVariables, Variable} from "../../../constants";
import {useRecoilValue} from "recoil";
import {selectedSessionState, sessionState} from "../../../state/session";
import {useInterval} from "../../../utils/useInterval";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrapper: {
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        },
        container: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 140,
            width: "100%"
        },
        progressBar: {
            width: "100%",
            borderRadius: 4
        },
        calculatingText: {
            marginTop: theme.spacing(1)
        }
    })
);

interface Props {
    variable: Variable;
    id?: number;
}

function CalculatingIndicator(props: Props): JSX.Element {
    const classes = useStyles();

    const [intervalStarted, setIntervalStarted] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const session = props.id ? useRecoilValue(sessionState(props.id)) : useRecoilValue(selectedSessionState);

    const calculationTime = MMDVariables[props.variable].calculationTime;

    useInterval(
        () => {
            if (session) {
                const difference = (new Date().getTime() - session.startTime) / 1000;
                if (calculationTime) {
                    const progress = difference / calculationTime;

                    if (progress > 1) {
                        setIntervalStarted(false);
                        setProgress(100);
                    } else {
                        setProgress(progress * 100);
                    }
                }
            }
        },
        intervalStarted ? 100 : null
    );

    useEffect(() => {
        if (!intervalStarted && session) {
            setIntervalStarted(true);
        }
    }, [session]);

    return (
        <div className={classes.wrapper}>
            <div className={classes.container}>
                <LinearProgress
                    className={classes.progressBar}
                    color="secondary"
                    variant="determinate"
                    value={progress}
                />
                <Typography variant="caption" className={classes.calculatingText}>
                    Calculating...
                </Typography>
            </div>
        </div>
    );
}

export default CalculatingIndicator;
