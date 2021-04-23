import {createStyles, makeStyles, Typography} from "@material-ui/core";
import {useRecoilValue} from "recoil";
import {MMDVariables, Variable} from "../../../../constants";
import {View} from "../../../../state/dashboard";
import {sessionState, sessionVariableDataLengthState} from "../../../../state/session";
import CalculatingIndicator from "../CalculatingIndicator";
import LineChart from "../LineChart";
import Numeric from "../Numeric";
import XRangeChart from "../XRangeChart";

const useStyles = makeStyles(() =>
    createStyles({
        content: {
            position: "relative",
            display: "grid",
            gridAutoRows: "24px 126px",
            gap: 16
        },
        studentName: {
            fontSize: 14,
            fontWeight: "bold"
        }
    })
);

interface Props {
    id: number;
    variable: Variable;
    view: View;
}

export default function ContainerItem(props: Props): JSX.Element {
    const classes = useStyles();

    const session = useRecoilValue(sessionState(props.id));
    const dataLength = useRecoilValue(sessionVariableDataLengthState([props.variable, props.id]));

    return (
        <>
            {session && (
                <div className={classes.content}>
                    <Typography noWrap className={classes.studentName}>
                        {session.studentName}
                    </Typography>
                    {MMDVariables[props.variable].calculationTime && dataLength == 0 ? (
                        <CalculatingIndicator variable={props.variable} id={props.id} />
                    ) : props.view === "chart" && props.variable != Variable.EducationalSpecificEmotions ? (
                        <LineChart variable={props.variable} id={props.id} />
                    ) : props.view === "chart" ? (
                        <XRangeChart variable={props.variable} id={props.id} />
                    ) : (
                        <Numeric variable={props.variable} id={props.id} />
                    )}
                </div>
            )}
        </>
    );
}