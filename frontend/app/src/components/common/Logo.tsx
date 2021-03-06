import React from "react";
import logo from "../../assets/images/LCI_logo.png";
import {createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        logo: {
            display: "block"
        },
        absolute: {
            position: "absolute",
            top: 0,
            left: 0
        }
    })
);

interface Props {
    absolute?: boolean;
}

/**
 * A logo component
 * @param {object} props Component props
 * @param {boolean} props.absolute Whether the logo is absolutely positioned
 * at the top left corner or relatively positioned
 */
export default function Logo(props: Props): JSX.Element {
    const classes = useStyles();

    return <img className={`${classes.logo} ${props.absolute && classes.absolute}`} src={logo} alt="LCI lab logo" />;
}
