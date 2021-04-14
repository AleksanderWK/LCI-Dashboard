import {Card, CardContent, createStyles, makeStyles, SvgIcon, SvgIconProps, Theme} from "@material-ui/core";
import {useState} from "react";
import {useRecoilValue} from "recoil";
import {selectedSessionIdState} from "../../state/session";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            width: "100%",
            height: "100%",
            position: "relative"
        },
        contentNoStudent: {
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto 1fr",
            gap: theme.spacing(2),
            position: "relative",
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
            "$:hover": {
                cursor: "default"
            }
        },
        content: {
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto auto 1fr",
            position: "relative",
            height: "100%",
            width: "100%",
            boxSizing: "border-box"
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

    const selectedSession = useRecoilValue(selectedSessionIdState);

    return (
        <Card variant="outlined" className={classes.card}>
            <CardContent className={selectedSession == null ? classes.content : classes.contentNoStudent}>
                {props.children}
            </CardContent>
        </Card>
    );
}
