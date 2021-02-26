import {createMuiTheme} from "@material-ui/core";

// Extend types for themes
declare module "@material-ui/core/styles/createPalette" {
    interface TypeText {
        default: string;
        placeholder: string;
        title: string;
        graphLabel: string;
    }
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#FAA61A"
        },
        secondary: {
            main: "#00509E"
        },
        background: {
            default: "#F6F7F8"
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
        h1: {
            fontSize: 24,
            fontWeight: "bold"
        },
        h2: {
            fontSize: 18,
            fontWeight: "bold"
        },
        caption: {
            fontSize: 14,
            lineHeight: 1.2,
            letterSpacing: "normal"
        }
    }
});

export default theme;
