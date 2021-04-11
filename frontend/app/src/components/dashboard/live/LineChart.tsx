import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, {RefObject, useRef, useState} from "react";
import {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {FREQUENCY, LIVE_CHART_RANGE, MMDVariables, Variable} from "../../../constants";
import {
    selectedSessionActiveContainersState,
    selectedSessionDataState,
    sessionVariableDataState
} from "../../../state/session";
import theme from "../../../theme";

interface Props {
    variable: Variable;
    id?: number;
}

function LineChart(props: Props): JSX.Element {
    const chart = useRef<{chart: Highcharts.Chart; container: RefObject<HTMLDivElement>}>(null);

    const [chartOptions] = useState<Highcharts.Options>({
        // Initial options for chart
        chart: {
            marginLeft: 40,
            animation: false
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

    const selectedSessionData = useRecoilValue(selectedSessionDataState);
    const activeContainers = useRecoilValue(selectedSessionActiveContainersState);

    let allSessionsData: [number, number][] | null = null;
    if (props.id) {
        allSessionsData = useRecoilValue(sessionVariableDataState([props.variable, props.id])) as [number, number][];
    }

    useEffect(() => {
        if (chart.current) {
            const data = props.id && allSessionsData ? [...allSessionsData] : [...selectedSessionData[props.variable]];
            // Update series data

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

            // Higher animation duration than update rate breaks the animation
            chart.current.chart.redraw({duration: 400});
        }
    }, [selectedSessionData, allSessionsData]);

    useEffect(() => {
        // If active containers is changed, reflow graph as container size may have changed
        if (chart.current) {
            chart.current.chart.reflow();
        }
    }, [activeContainers]);

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chart} />;
}

export default React.memo(LineChart);
