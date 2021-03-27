import {makeStyles, createStyles} from "@material-ui/core";
import {useRecoilValue} from "recoil";
import {Variable} from "../../../constants";
import {selectedSessionActiveContainersState} from "../../../state/session";
import Container from "./Container";

const useStyles = makeStyles(() =>
    createStyles({
        dashboard: {
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 2,
            gridRowEnd: 3,
            position: "relative",
            width: "100%",
            padding: "20px 40px",
            boxSizing: "border-box",

            // Temporary grid
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gridAutoRows: "200px",
            gap: 40
        }
    })
);

function Dashboard(): JSX.Element {
    const classes = useStyles();

    const activeContainers = useRecoilValue(selectedSessionActiveContainersState);

    return (
        <div className={classes.dashboard}>
            {Object.values(Variable)
                .filter((variable) => activeContainers[variable].active)
                .map((variable) => {
                    return (
                        <Container key={variable} variable={variable} display={activeContainers[variable].display} />
                    );
                })}
        </div>
    );
}

export default Dashboard;
