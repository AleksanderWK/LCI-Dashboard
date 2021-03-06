import {createStyles, makeStyles} from "@material-ui/core";
import {Variable} from "../../constants";
import Container from "./Container";

const useStyles = makeStyles(() =>
    createStyles({
        dashboard: {
            padding: "0 40px",
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 2,
            gridRowEnd: 3
        }
    })
);

function Dashboard(): JSX.Element {
    const classes = useStyles();

    return (
        <div className={classes.dashboard}>
            <Container variable={Variable.PerceivedDifficulty} />
        </div>
    );
}

export default Dashboard;
