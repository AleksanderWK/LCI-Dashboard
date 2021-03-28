import {createStyles, makeStyles, Typography} from "@material-ui/core";
import {useRecoilState, useRecoilValue} from "recoil";
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

    const activeContainers = useRecoilValue(selectedSessionActiveContainersState);

    return (
        <div className={classes.dashboard}>
            {Object.values(Variable).every((variable) => activeContainers[variable].active === false) ? (
                <Typography>No charts added</Typography>
            ) : (
                Object.values(Variable).map((key) => {
                    if (activeContainers[key].active) {
                        return <Container variable={key} display={activeContainers[key].display} />;
                    }
                })
            )}
        </div>
    );
}

export default Dashboard;
