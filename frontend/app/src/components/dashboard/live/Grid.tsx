import {createStyles, makeStyles} from "@material-ui/core";
import React, {useMemo} from "react";
import GridLayout, {Layout, WidthProvider} from "react-grid-layout";
import {useRecoilCallback, useRecoilState, useRecoilValue} from "recoil";
import {Variable} from "../../../constants";
import {
    selectedSessionActiveContainersState,
    selectedSessionLayoutItemState,
    selectedSessionLayoutState
} from "../../../state/dashboard";
import packer from "../../../utils/packer";
import {ResizeIcon} from "../../common/Icons";
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

const StaticGridLayout = WidthProvider(GridLayout);

export default function Grid(): JSX.Element {
    const classes = useStyles();

    const selectedSessionActiveContainers = useRecoilValue(selectedSessionActiveContainersState);

    const [selectedSessionLayout, setSelectedSessionLayout] = useRecoilState(selectedSessionLayoutState);

    const getLayoutItem = useRecoilCallback(({snapshot}) => (variable: Variable): Layout | undefined => {
        return snapshot.getLoadable(selectedSessionLayoutItemState(variable)).getValue();
    });

    const containers = useMemo(() => {
        const layout: Layout[] = [];
        return selectedSessionActiveContainers.map((variable) => {
            const existingItem = getLayoutItem(variable);
            const item = existingItem
                ? existingItem
                : {i: variable, w: 4, h: 3, minW: 2, minH: 3, ...packer(4, 3, layout, 12)};
            layout.push(item);
            return (
                <div key={variable} data-grid={item}>
                    <Container variable={variable} />
                </div>
            );
        });
    }, [selectedSessionActiveContainers]);

    return (
        <StaticGridLayout
            cols={12}
            rowHeight={60}
            containerPadding={[0, 0]}
            margin={[10, 10]}
            draggableCancel=".noDrag"
            isBounded
            resizeHandle={<ResizeIcon className={`${classes.resizeIcon} noDrag`} color="action" />}
            layout={selectedSessionLayout}
            onLayoutChange={(layout) => {
                console.log(layout);

                if (JSON.stringify(layout) !== JSON.stringify(selectedSessionLayout)) {
                    setSelectedSessionLayout(layout);
                }
            }}
        >
            {containers}
        </StaticGridLayout>
    );
}
