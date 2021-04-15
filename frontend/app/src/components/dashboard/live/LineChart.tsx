import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, {RefObject, useRef, useState} from "react";
import {useEffect} from "react";
import {useRecoilCallback, useRecoilValue} from "recoil";
import {FREQUENCY, LIVE_CHART_RANGE, MMDVariables, Variable} from "../../../constants";
import {
    breakpointState,
    selectedSessionActiveContainersState,
    selectedSessionLayoutsState
} from "../../../state/dashboard";
import {selectedSessionDataState, selectedSessionIdState, sessionVariableDataState} from "../../../state/session";
import theme from "../../../theme";
import {useChartCallbacks} from "../../../utils/useChartCallbacks";

interface Props {
    variable: Variable;
    id?: number;
}

function LineChart(props: Props): JSX.Element {
    const chart = useRef<{chart: Highcharts.Chart; container: RefObject<HTMLDivElement>}>(null);

    const [chartId, insertCallback, removeCallback] = useChartCallbacks();

    const [chartOptions] = useState<Highcharts.Options>({
        // Initial options for chart
        chart: {
            marginLeft: 40,
            animation: false,
            events: {
                load: () => {
                    // Insert update callback function on load
                    // Callback will be called every 0.5s until removed (on unmount)
                    insertCallback(() => updateChart(400));
                }
            }
        },
        title: {
            text: undefined
        },
        plotOptions: {
            series: {
                animation: false
            },
            line: {
                marker: {
                    enabled: false
                },
                lineWidth: 3,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        const {series, x, y} = this;

                        // Show only the label for the latest data point
                        if (
                            y &&
                            x &&
                            x === series.data[series.data.length - 1].x &&
                            y === series.data[series.data.length - 1].y
                        ) {
                            return y > 0 && y < 1 ? y.toFixed(1) : y.toFixed();
                        }
                        return null;
                    }
                },
                enableMouseTracking: true
            }
        },
        series: [
            {
                type: "line",
                name: MMDVariables[props.variable].name,
                color: theme.palette.secondary.main,
                states: {
                    hover: {
                        lineWidthPlus: 0
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
            min: 0,
            max: MMDVariables[props.variable].maxValue,
            title: {
                text: undefined
            },
            gridLineWidth: 0
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

    const updateChart = useRecoilCallback(({snapshot}) => (animationDuration?: number) => {
        if (chart.current) {
            const data = props.id
                ? [...snapshot.getLoadable(sessionVariableDataState([props.variable, props.id])).getValue()]
                : [...snapshot.getLoadable(selectedSessionDataState).getValue()[props.variable]];

            const dataLength = data.length;

            // Update series data
            chart.current.chart.series[0].setData(
                [...data.slice(Math.max(dataLength - FREQUENCY * LIVE_CHART_RANGE, 0))],
                false
            );

            if (dataLength >= FREQUENCY * LIVE_CHART_RANGE) {
                // Graph starts moving after the amount of data points to fill the LIVE_CHART_RANGE is reached
                chart.current.chart.xAxis[0].setExtremes(
                    // Set min value on xAxis to be LIVE_CHART_RANGE, from the last data point
                    data.slice(-(FREQUENCY * LIVE_CHART_RANGE))[0][0],
                    undefined,
                    false
                );
            } else if (dataLength > 0 && dataLength < FREQUENCY * LIVE_CHART_RANGE) {
                chart.current.chart.xAxis[0].setExtremes(data[0][0], undefined, false);
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

    useEffect(() => {
        // Update chart when session changes
        // (containers with same variable across sessions are not rerendered, due to performance)
        updateChart();
    }, [selectedSessionId]);

    const activeContainers = useRecoilValue(selectedSessionActiveContainersState);
    const layouts = useRecoilValue(selectedSessionLayoutsState);
    const breakpoint = useRecoilValue(breakpointState);

    useEffect(() => {
        // If active containers/layouts/breakpoint is changed, reflow graph as container size may have changed
        if (chart.current) {
            chart.current.chart.reflow();
        }
    }, [activeContainers, layouts, breakpoint]);

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chart} />;
}

export default React.memo(LineChart);
