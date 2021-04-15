import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import React from "react";
import {useRecoilValue} from "recoil";
import {snackOpenState} from "../../state/session";

export default function Snackbars(): JSX.Element {
    const snackOpen = useRecoilValue(snackOpenState);

    return (
        <>
            <Snackbar open={snackOpen} anchorOrigin={{vertical: "bottom", horizontal: "right"}} style={{zIndex: 2}}>
                <Alert severity="success">Recording has been saved</Alert>
            </Snackbar>
        </>
    );
}
