import {Card, CardContent, createStyles, makeStyles, Theme} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            width: "100%",
            height: "100%",
            position: "relative",
            boxSizing: "border-box"
        },
        content: {
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto 1fr",
            gap: theme.spacing(2),
            position: "relative",
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
            "&:last-child": {
                paddingBottom: 16
            }
        },
        resizeIcon: {
            position: "absolute",
            right: "4px",
            bottom: "4px",
            width: "10px",
            height: "10px",
            "&:hover": {
                cursor: "nw-resize"
            }
        }
    })
);

interface Props {
    children: JSX.Element;
}

export default function Container(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <Card variant="outlined" className={classes.card}>
            <CardContent className={classes.content}>{props.children}</CardContent>
        </Card>
    );
}
