import {createStyles, makeStyles} from "@material-ui/core";

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
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gridAutoRows: "200px",
            gap: 40
        }
    })
);

interface Props {
    children: JSX.Element;
}

function DashboardWrapper(props: Props): JSX.Element {
    const classes = useStyles();

    return <div className={classes.dashboard}>{props.children}</div>;
}

export default DashboardWrapper;
