import {createStyles, makeStyles, Theme, Tooltip} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        buttonWrapper: {
            position: "relative",
            display: "flex",
            justifyContent: "center"
        },
        button: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            border: "3px solid",
            borderColor: theme.palette.primary.main,
            boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.25)",
            outline: 0,
            cursor: "pointer",
            padding: 0,
            margin: 0,
            color: theme.palette.text.default,
            transition: "box-shadow 0.15s linear",
            "&:hover": {
                boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.4)"
            }
        },
        tooltip: {
            marginLeft: 10
        },
        indicator: {
            position: "absolute",
            bottom: 7,
            left: 0,
            backgroundColor: "#B9B9B9",
            width: "6px",
            height: "46px",
            borderRadius: "0 10px 10px 0"
        }
    })
);

interface Props {
    children: JSX.Element;
    selected: boolean;
    tooltip: string;
    onClick: () => void;
}

/**
 * A wrapper component for a menu button
 * @param {object} props - Component props
 * @param {JSX.Element} props.children - The content of the menu button
 * @param {boolean} props.selected - Whether this button is selected or not
 * @param {tring} props.tooltip - Tooltip content for the menu button
 */
export default function MenuButton(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <div className={classes.buttonWrapper}>
            <Tooltip title={props.tooltip} classes={{tooltipPlacementRight: classes.tooltip}} placement="right">
                <button className={classes.button} onClick={props.onClick}>
                    {props.children}
                </button>
            </Tooltip>
            {props.selected && <div className={classes.indicator}></div>}
        </div>
    );
}
