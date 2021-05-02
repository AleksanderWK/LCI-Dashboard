import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, {RefObject, useRef, useState} from "react";
import {useEffect} from "react";
import {useRecoilCallback, useRecoilValue} from "recoil";
import {FREQUENCY, LIVE_CHART_RANGE, Variable} from "../../../constants";
import {
    selectedSessionDataState,
    selectedSessionESEXRangeDataState,
    selectedSessionIdState,
    sessionDataState,
    sessionESEXRangeDataState
} from "../../../state/session";
import theme from "../../../theme";
import xrange from "../../../assets/xrange";
import {useChartCallbacks} from "../../../utils/useChartCallbacks";
import {selectedSessionActiveContainersState, selectedSessionLayoutState} from "../../../state/dashboard";

xrange(Highcharts);

interface Props {
    variable: Variable;
    id?: number;
}

/**
 * An x-range chart for a given variable.
 * @param {object} props - Component props
 * @param {Variable} props.variable - The variable to render the x-range chart for
 * @param {number} props.id - The session ID of the session this x-range chart applies to.
 * If not set, the selected session is used.
 */
function XRangeChart(props: Props): JSX.Element {
    const chart = useRef<{chart: Highcharts.Chart; container: RefObject<HTMLDivElement>}>(null);

    const [chartId, insertCallback, removeCallback] = useChartCallbacks();

    const [chartOptions] = useState<Highcharts.Options>({
        // Initial options for chart
        chart: {
            type: "xrange",
            animation: false,
            events: {
                load: () => {
                    // Insert update callback function on load
                    // Callback will be called every 0.5s until removed (on unmount)
                    insertCallback(() => updateChart(400));
                }
            }
        },
        plotOptions: {
            series: {
                animation: false
            }
        },
        title: {
            text: undefined
        },
        series: [
            {
                type: "xrange",
                name: "Emotion",
                pointWidth: 18,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        ],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        yAxis: {
            categories: ["Bored", "Frustrated", "Confused", "Delighted"],
            reversed: true,
            title: {
                text: undefined
            },
            gridLineWidth: 0,
            min: 0,
            max: 3
        },
        xAxis: {
            type: "datetime",
            minTickInterval: 1000 * 5, // Show xAxis labels minimum every 5 second
            lineWidth: 0,
            tickLength: 0
        },
        time: {
            timezoneOffset: new Date().getTimezoneOffset()
        },
        tooltip: {
            dateTimeLabelFormats: {
                second: "%H:%M:%S",
                millisecond: "%H:%M:%S"
            },
            valueDecimals: 2,
            shadow: false,
            borderWidth: 0,
            borderRadius: 8,
            backgroundColor: theme.palette.background.tooltip,
            style: {
                color: "#FFFFFF"
            }
        }
    });

    /**
     * Gets data stored for the session and variable in state, and inserts it into the chart
     */
    const updateChart = useRecoilCallback(({snapshot}) => (animationDuration?: number) => {
        if (chart.current) {
            const rawData = props.id
                ? [...snapshot.getLoadable(sessionDataState(props.id)).getValue()[props.variable]]
                : [...snapshot.getLoadable(selectedSessionDataState).getValue()[props.variable]];

            const processedData = props.id
                ? [...snapshot.getLoadable(sessionESEXRangeDataState(props.id)).getValue().data]
                : [...snapshot.getLoadable(selectedSessionESEXRangeDataState).getValue().data];

            chart.current.chart.series[0].setData(processedData, false);

            if (rawData.length > 0) {
                // Graph starts moving after the amount of data points to fill the LIVE_CHART_RANGE is reached
                chart.current.chart.xAxis[0].setExtremes(
                    rawData.length >= FREQUENCY * LIVE_CHART_RANGE
                        ? // Set min value on xAxis to be LIVE_CHART_RANGE, from the last data point
                          rawData.slice(-(FREQUENCY * LIVE_CHART_RANGE))[0][0]
                        : undefined,
                    rawData[rawData.length - 1][0],
                    false
                );
            }

            chart.current.chart.redraw(animationDuration ? {duration: animationDuration} : false);
        }
    });

    useEffect(() => {
        if (chartId) {
            // Update chart on component mount
            updateChart();

            return () => {
                // Remove update callback function on unmount
                if (chartId) {
                    removeCallback(chartId);
                }
            };
        }
    }, [chartId]);

    const selectedSessionId = useRecoilValue(selectedSessionIdState);

    /**
     * Update chart when session changes
     * (containers with same variable across sessions are not rerendered, due to performance)
     */
    useEffect(() => {
        updateChart();
    }, [selectedSessionId]);

    const activeContainers = useRecoilValue(selectedSessionActiveContainersState);
    const layout = useRecoilValue(selectedSessionLayoutState);

    /**
     * If active containers/layout is changed, reflow graph as container size may have changed
     */
    useEffect(() => {
        if (chart.current) {
            chart.current.chart.reflow();
        }
    }, [activeContainers, layout]);

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chart} />;
}

export default React.memo(XRangeChart);
