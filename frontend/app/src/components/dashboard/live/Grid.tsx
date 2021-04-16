import {createStyles, makeStyles, SvgIcon, SvgIconProps} from "@material-ui/core";
import React, {useMemo} from "react";
import {Layout, Responsive, WidthProvider} from "react-grid-layout";
import {useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {Variable} from "../../../constants";
import {
    breakpointState,
    selectedSessionActiveContainersState,
    selectedSessionLayoutItemState,
    selectedSessionLayoutsState
} from "../../../state/dashboard";
import Container from "./Container";

const useStyles = makeStyles(() =>
    createStyles({
        dashboard: {
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

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Grid(): JSX.Element {
    const classes = useStyles();

    const setBreakpoint = useSetRecoilState(breakpointState);

    const selectedSessionActiveContainers = useRecoilValue(selectedSessionActiveContainersState);

    const [selectedSessionLayouts, setSelectedSessionLayouts] = useRecoilState(selectedSessionLayoutsState);

    const getLayout = useRecoilCallback(({snapshot}) => (variable: Variable): Layout | undefined => {
        return snapshot.getLoadable(selectedSessionLayoutItemState(variable)).getValue();
    });

    const containers = useMemo(
        () =>
            selectedSessionActiveContainers.map((variable) => {
                const layout = getLayout(variable);

                return (
                    <div
                        key={variable}
                        data-grid={layout ? layout : {i: variable, x: 0, y: Infinity, w: 4, h: 3, minW: 2, minH: 3}}
                    >
                        <Container variable={variable} />
                    </div>
                );
            }),
        [selectedSessionActiveContainers.length]
    );

    return (
        <ResponsiveGridLayout
            style={{position: "relative"}}
            breakpoints={{lg: 1200, md: 768, sm: 0}}
            onBreakpointChange={(breakpoint) => {
                setBreakpoint(breakpoint);
            }}
            cols={{lg: 12, md: 8, sm: 6}}
            rowHeight={60}
            containerPadding={[0, 0]}
            margin={[10, 10]}
            draggableCancel=".noDrag"
            isBounded
            resizeHandle={<ResizeIcon className={`${classes.resizeIcon} ${"noDrag"}`} color="action" />}
            layouts={selectedSessionLayouts}
            onLayoutChange={(_, layouts) => {
                if (JSON.stringify(layouts) !== JSON.stringify(selectedSessionLayouts)) {
                    setSelectedSessionLayouts(layouts);
                }
            }}
        >
            {containers}
        </ResponsiveGridLayout>
    );
}
