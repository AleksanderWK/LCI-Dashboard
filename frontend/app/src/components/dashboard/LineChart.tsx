import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, {createRef, RefObject} from "react";
import {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {FREQUENCY, LIVE_CHART_RANGE, Variable} from "../../constants";
import {selectedSessionDataState} from "../../state/session";
import theme from "../../theme";

// Initial options for chart
const options: Highcharts.Options = {
    chart: {
        marginLeft: 40,
        height: 200
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
                    return x === series.data[series.data.length - 1].x && y === series.data[series.data.length - 1].y
                        ? y
                        : null;
                }
            },
            enableMouseTracking: true
        }
    },
    series: [
        {
            type: "line",
            name: "Cognitive Load",
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
        max: 100,
        title: {
            text: undefined
        },
        tickInterval: 20,
        gridLineWidth: 0
    },
    xAxis: {
        type: "datetime",
        minTickInterval: 1000 * 5, // Show xAxis labels minimum every 5 second
        lineWidth: 0,
        tickLength: 0
    },
    tooltip: {
        borderWidth: 0,
        dateTimeLabelFormats: {
            millisecond: "%H:%M:%S"
        },
        shadow: false,
        borderRadius: 8,
        backgroundColor: theme.palette.background.tooltip,
        style: {
            color: "#FFFFFF"
        }
    }
};

interface Props {
    variable: Variable;
}

function LineChart(props: Props): JSX.Element {
    const chart = createRef<{chart: Highcharts.Chart; container: RefObject<HTMLDivElement>}>();

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
                chart.current.chart.redraw();
            }
        }
    }, [selectedSessionData]);

    return <HighchartsReact highcharts={Highcharts} options={options} ref={chart} />;
}

export default React.memo(LineChart);
