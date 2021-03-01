import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";
import {useEffect, useState} from "react";
import theme from "../../theme";

// Initial options for chart
const options: Highcharts.Options = {
    chart: {
        marginLeft: 40,
        height: 200,
        animation: {
            duration: 0
        }
    },
    title: {
        text: undefined
    },
    plotOptions: {
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
            data: [[new Date().getTime(), 50]],
            color: theme.palette.secondary.main
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
        minTickInterval: 1000 * 10,
        minRange: 30000, // Show the last 30 seconds
        maxRange: 30000,
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

function LineChart(props: HighchartsReact.Props): JSX.Element {
    let chart: Highcharts.Chart | undefined = undefined;

    // Use setChartOptions (and spread operator) to change the intial chart options after mount
    const [chartOptions] = useState<Highcharts.Options>(options);

    const [intervalRunning, setIntervalRunning] = useState<boolean>(false);

    useEffect(() => {
        if (process.env.NODE_ENV === "test") {
            Highcharts.useSerialIds(true);
        }

        if (chart && !intervalRunning) {
            const addDataPoint = () => {
                if (chart) {
                    // Useless logic to compute the next data point
                    const change = [1, 0, -1];
                    const dataChange = change[Math.floor(Math.random() * change.length)];

                    const newPoint = chart.series[0].data[chart.series[0].data.length - 1]!.y! + dataChange;

                    // Add data point
                    chart.series[0].addPoint(
                        [new Date().getTime(), newPoint],
                        true,
                        chart.series[0].data.length > 60, // Graph starts moving after 60 data points have been added (30 seconds)
                        true // Animations off (minimize CPU usage)
                    );
                }
            };

            // Add new data point every 100 ms
            setInterval(() => {
                addDataPoint();
            }, 500);

            setIntervalRunning(true);
        }
    }, [chart, chartOptions, intervalRunning]);

    return (
        <div>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                callback={(c: Highcharts.Chart) => {
                    chart = c;
                }}
                {...props}
            />
        </div>
    );
}

export default React.memo(LineChart);
