import React from "react";
import {createStyles, makeStyles, Theme, Typography} from "@material-ui/core";
import {useRecoilValue} from "recoil";
import {emotionsColorMapper, Variable} from "../../../constants";
import {
    selectedSessionLastValueState,
    sessionVariableDataState,
    EducationalSpecificEmotions
} from "../../../state/session";

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
        },
        emotionsContainer: {
            display: "grid",
            gridTemplateColumns: "auto",
            maxHeight: "100%",
            gap: 4
        },
        emotion: {
            display: "grid",
            gridTemplateColumns: "16px auto",
            gap: theme.spacing(1),
            alignItems: "center"
        },
        emotionIndicator: {
            width: 16,
            height: 16,
            borderRadius: 4
        },
        emotionText: {
            fontSize: 20,
            color: theme.palette.text.default
        },
        neutralText: {
            fontSize: 20,
            color: theme.palette.text.placeholder
        }
    })
);

function EmotionsDisplay(props: {emotions: EducationalSpecificEmotions}): JSX.Element {
    const classes = useStyles();

    const emotions = Object.entries(props.emotions)
        .filter(([, value]) => value)
        .map(([emotion]) => {
            let text = null;

            switch (emotion) {
                case "boredom":
                    text = "Bored";
                    break;
                case "frustration":
                    text = "Frustrated";
                    break;
                case "confusion":
                    text = "Confused";
                    break;
                default:
                    text = "Delighted";
            }

            return (
                <div key={emotion} className={classes.emotion}>
                    <div
                        className={classes.emotionIndicator}
                        style={{backgroundColor: emotionsColorMapper[emotion]}}
                    ></div>
                    <Typography className={classes.emotionText}>{text}</Typography>
                </div>
            );
        });

    return (
        <div className={classes.emotionsContainer}>
            {emotions.length > 0 ? emotions : <Typography className={classes.neutralText}>Neutral</Typography>}
        </div>
    );
}

interface Props {
    variable: Variable;
    id?: number;
}

function Numeric(props: Props): JSX.Element {
    const classes = useStyles();

    const dataPoint = !props.id
        ? useRecoilValue(selectedSessionLastValueState(props.variable))
        : useRecoilValue(sessionVariableDataState([props.variable, props.id])).slice(-1)[0][1];

    return (
        <div className={`${"noDrag"} ${classes.numericWrapper}`}>
            {dataPoint && props.variable !== Variable.EducationalSpecificEmotions ? (
                <Typography className={classes.numeric}>{Math.round(dataPoint as number)}</Typography>
            ) : dataPoint && props.variable == Variable.EducationalSpecificEmotions ? (
                <EmotionsDisplay emotions={dataPoint as EducationalSpecificEmotions} />
            ) : (
                <Typography className={classes.noData}>No data received</Typography>
            )}
        </div>
    );
}

export default Numeric;
