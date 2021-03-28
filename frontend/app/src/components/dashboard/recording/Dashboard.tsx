import {Variable} from "../../../constants";
import {createStyles, makeStyles} from "@material-ui/core";
import Container from "./Container";

const useStyles = makeStyles(() =>
    createStyles({
        dashboard: {
            position: "relative",
            width: "100%",
            padding: "30px 0",
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

    return (
        <div className={classes.dashboard}>
            {Object.values(Variable).map((variable) => {
                return <Container key={variable} variable={variable} />;
            })}
        </div>
    );
}

export default Dashboard;
