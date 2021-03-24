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
            {activeContainers.cl && <Container variable={Variable.CognitiveLoad} />}
            {activeContainers.pd && <Container variable={Variable.PerceivedDifficulty} />}
            {activeContainers.fam && <Container variable={Variable.Familiarity} />}
            {activeContainers.ipi && <Container variable={Variable.InformationProcessingIndex} />}
            {activeContainers.pa && <Container variable={Variable.PhysiologicalArousal} />}
            {activeContainers.eng && <Container variable={Variable.Engagement} />}
            {activeContainers.ps && <Container variable={Variable.PhysiologicalStress} />}
            {activeContainers.er && <Container variable={Variable.EmotionalRegulation} />}
            {activeContainers.ms && <Container variable={Variable.MotionStability} />}
            {activeContainers.esf && <Container variable={Variable.EnergySpentFatigue} />}
        </div>
    );
}

export default Dashboard;
