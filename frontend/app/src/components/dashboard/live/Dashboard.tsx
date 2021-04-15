import {createStyles, makeStyles, Typography, Theme, SvgIcon, SvgIconProps} from "@material-ui/core";
import {useRecoilState, useRecoilValue} from "recoil";
import Container from "./Container";
import {Layouts, Responsive, WidthProvider} from "react-grid-layout";
import {useState} from "react";
import {
    selectedSessionActiveContainersState,
    selectedSessionDashboardColumnsState,
    selectedSessionDashboardLayoutsState
} from "../../../state/dashboard";

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
            boxSizing: "border-box"
        },
        feedback: {
            position: "relative",
            margin: "30px 0",
            width: "100%",
            height: "calc(100% - 86px - 30px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        },
        resizeIcon: {
            position: "absolute",
            right: "4px",
            bottom: "4px",
            width: "10px",
            height: "10px",
            "&:hover": {
                cursor: "se-resize"
            }
        }
    })
);

function ResizeIcon(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props}>
            <path d="M24 24H19.2V19.2H24V24ZM24 14.4H19.2V9.6H24V14.4ZM14.4 24H9.6V19.2H14.4V24ZM14.4 14.4H9.6V9.6H14.4V14.4ZM4.8 24H0V19.2H4.8V24ZM24 4.8H19.2V0H24V4.8Z" />
        </SvgIcon>
    );
}

function Dashboard(): JSX.Element {
    const classes = useStyles();
    const ResponsiveGridLayout = WidthProvider(Responsive);

    const [layouts, setLayouts] = useRecoilState(selectedSessionDashboardLayoutsState);
    const [columns, setColumns] = useRecoilState(selectedSessionDashboardColumnsState);
    const selectedSessionActiveContainers = useRecoilValue(selectedSessionActiveContainersState);
    const [totalWidth, setTotalWidth] = useState<number>(0);

    const decideX = (): number => {
        console.log("render");
        if (columns) {
            return totalWidth % columns;
        }
        return 0;
    };

    const layoutsEqual = (layoutsA: Layouts, layoutsB: Layouts | undefined): boolean => {
        return JSON.stringify(layoutsA) == JSON.stringify(layoutsB);
    };

    return (
        <>
            {selectedSessionActiveContainers.length == 0 ? (
                <div className={classes.feedback}>
                    <Typography>No variables selected</Typography>
                </div>
            ) : (
                <div className={classes.dashboard}>
                    <ResponsiveGridLayout
                        style={{position: "relative"}}
                        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
                        cols={{lg: 6, md: 4, sm: 2, xs: 2, xxs: 1}}
                        rowHeight={240}
                        draggableCancel=".noDrag"
                        isBounded
                        resizeHandle={<ResizeIcon className={`${classes.resizeIcon} ${"noDrag"}`} color="action" />}
                        onBreakpointChange={(b, cols) => {
                            setColumns(cols);
                        }}
                    >
                        {selectedSessionActiveContainers.map((variable) => {
                            return (
                                <div
                                    key={variable}
                                    data-grid={{
                                        i: variable,
                                        x: 0,
                                        y: Infinity,
                                        w: 2,
                                        h: 1,
                                        minH: 1,
                                        minW: 2
                                    }}
                                >
                                    <Container key={variable} variable={variable} />
                                </div>
                            );
                        })}
                    </ResponsiveGridLayout>
                </div>
            )}
        </>
    );
}

export default Dashboard;
