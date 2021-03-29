import {createStyles, makeStyles, Typography, Theme} from "@material-ui/core";
import {useRecoilValue} from "recoil";
import {Variable} from "../../../constants";
import {selectedSessionActiveContainersState} from "../../../state/session";
import Container from "./Container";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dashboard: {
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 2,
            gridRowEnd: 3,
            position: "relative",
            width: "100%",
            padding: "30px 0",
            boxSizing: "border-box",

            // Temporary grid
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gridAutoRows: "200px",
            gap: 40
        },
        feedback: {
            position: "relative",
            margin: "30px 0",
            width: "100%",
            height: "calc(100% - 86px - 30px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    })
);

function Dashboard(): JSX.Element {
    const classes = useStyles();

    const activeContainers = useRecoilValue(selectedSessionActiveContainersState);

    return (
        <>
            {Object.values(Variable).every((variable) => activeContainers[variable].active === false) ? (
                <div className={classes.feedback}>
                    <Typography>No charts selected</Typography>
                </div>
            ) : (
                <div className={classes.dashboard}>
                    {Object.values(Variable)
                        .filter((variable) => activeContainers[variable].active)
                        .map((variable) => {
                            return (
                                <Container
                                    key={variable}
                                    variable={variable}
                                    display={activeContainers[variable].display}
                                />
                            );
                        })}
                </div>
            )}
        </>
    );
}

export default Dashboard;
