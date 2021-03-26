import {createStyles, makeStyles} from "@material-ui/core";
import {useRecoilState} from "recoil";
import {Variable} from "../../../constants";
import {selectedSessionActiveContainersState} from "../../../state/session";
import Container from "./Container";

const useStyles = makeStyles(() =>
    createStyles({
        dashboard: {
            padding: "20px 40px",
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 2,
            gridRowEnd: 3
        }
    })
);

function Dashboard(): JSX.Element {
    const classes = useStyles();

    const [activeContainers, setActiveContainers] = useRecoilState(selectedSessionActiveContainersState);

    return (
        <div className={classes.dashboard}>
            {/*Object.entries(activeContainers).map(([key, value]) => {
                if (value.active) {
                    return <Container variable={Variable[key as keyof typeof Variable]} display={value.display} />;
                }
            })*/}
            {activeContainers.cl.active && (
                <Container variable={Variable.CognitiveLoad} display={activeContainers.cl.display} />
            )}
            {activeContainers.pd.active && (
                <Container variable={Variable.PerceivedDifficulty} display={activeContainers.pd.display} />
            )}
            {activeContainers.fam.active && (
                <Container variable={Variable.Familiarity} display={activeContainers.fam.display} />
            )}
            {activeContainers.ipi.active && (
                <Container variable={Variable.InformationProcessingIndex} display={activeContainers.ipi.display} />
            )}
            {activeContainers.pa.active && (
                <Container variable={Variable.PhysiologicalArousal} display={activeContainers.pa.display} />
            )}
            {activeContainers.eng.active && (
                <Container variable={Variable.Engagement} display={activeContainers.eng.display} />
            )}
            {activeContainers.ps.active && (
                <Container variable={Variable.PhysiologicalStress} display={activeContainers.ps.display} />
            )}
            {activeContainers.er.active && (
                <Container variable={Variable.EmotionalRegulation} display={activeContainers.er.display} />
            )}
            {activeContainers.ms.active && (
                <Container variable={Variable.MotionStability} display={activeContainers.ms.display} />
            )}
            {activeContainers.esf.active && (
                <Container variable={Variable.EnergySpentFatigue} display={activeContainers.esf.display} />
            )}
        </div>
    );
}

export default Dashboard;
