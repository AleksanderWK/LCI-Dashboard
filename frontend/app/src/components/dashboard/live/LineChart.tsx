import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, {createRef, RefObject, useState} from "react";
import {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {FREQUENCY, LIVE_CHART_RANGE, MMDVariables, Variable} from "../../../constants";
import {selectedSessionDataState} from "../../../state/session";
import theme from "../../../theme";

interface Props {
    variable: Variable;
}

function LineChart(props: Props): JSX.Element {
    const chart = createRef<{chart: Highcharts.Chart; container: RefObject<HTMLDivElement>}>();

    const [chartOptions] = useState<Highcharts.Options>({
        // Initial options for chart
        chart: {
            marginLeft: 40
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
                        return x === series.data[series.data.length - 1].x &&
                            y === series.data[series.data.length - 1].y
                            ? y?.toFixed()
                            : null;
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

    useEffect(() => {
        if (chart.current) {
            // Update series data
            chart.current.chart.series[0].setData([...selectedSessionData[props.variable]], false);

            if (selectedSessionData[props.variable].length >= FREQUENCY * LIVE_CHART_RANGE) {
                // Graph starts moving after the amount of data points to fill the LIVE_CHART_RANGE is reached
                chart.current.chart.xAxis[0].setExtremes(
                    // Set min value on xAxis to be LIVE_CHART_RANGE, from the last data point
                    selectedSessionData[props.variable].slice(-(FREQUENCY * LIVE_CHART_RANGE))[0][0],
                    undefined,
                    true // Redraw graph
                );
            } else {
                // No extremes if data is not covering LIVE_CHART_RANGE
                chart.current.chart.xAxis[0].setExtremes(
                    undefined,
                    undefined,
                    true // Redraw graph
                );
            }
        }
    }, [selectedSessionData]);

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chart} />;
}

export default React.memo(LineChart);
