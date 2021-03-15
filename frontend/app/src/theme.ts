import {createMuiTheme} from "@material-ui/core";
import Raleway from "./assets/fonts/Raleway-VariableFont_wght.ttf";

// Extend types for themes
declare module "@material-ui/core/styles/createPalette" {
    interface TypeText {
        default: string;
        placeholder: string;
        title: string;
        graphLabel: string;
    }

    interface TypeBackground {
        tooltip: string;
    }
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#FAA61A",
            dark: "#e19005"
        },
        secondary: {
            main: "#00509E"
        },
        background: {
            default: "#F6F7F8",
            tooltip: "rgba(97, 97, 97, 0.9)"
        },
        text: {
            default: "#535353",
            placeholder: "#949494",
            title: "#000000",
            graphLabel: "#BBBBBB"
        },
        action: {
            active: "#949494"
        }
    },
    typography: {
        fontFamily: Raleway,
        h1: {
            fontSize: 22,
            fontWeight: 600
        },
        h2: {
            fontSize: 18,
            fontWeight: "bold"
        },
        caption: {
            fontSize: 12,
            lineHeight: 1.2,
            letterSpacing: "normal"
        },
        body1: {
            color: "#535353"
        }
    }
});

export default theme;
