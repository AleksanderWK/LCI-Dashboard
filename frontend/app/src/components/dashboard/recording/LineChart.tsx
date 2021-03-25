import * as Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, {createRef, RefObject, useState} from "react";
import {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {MMDVariables, Variable} from "../../../constants";
import {recordedSessionState} from "../../../state/recordedSession";
import theme from "../../../theme";

interface Props {
    variable: Variable;
}

function LineChart(props: Props): JSX.Element {
    const chart = createRef<{chart: Highcharts.Chart; container: RefObject<HTMLDivElement>}>();

    const [chartOptions] = useState<Highcharts.Options>({
        // Initial options for chart
        chart: {
            marginLeft: 40,
            height: 200
        },
        title: {
            text: undefined
        },
        plotOptions: {
            series: {
                animation: false,
                color: theme.palette.secondary.main,
                states: {
                    hover: {
                        lineWidthPlus: 0
                    }
                },
                marker: {
                    symbol: "circle",
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                },
                dataGrouping: {
                    approximation: "average",
                    groupPixelWidth: 20,
                    dateTimeLabelFormats: {
                        millisecond: ["%H:%M:%S", "%H:%M:%S", "-%H:%M:%S"],
                        second: ["%H:%M:%S", "%H:%M:%S", "-%H:%M:%S"],
                        minute: ["%H:%M:%S", "%H:%M:%S", "-%H:%M:%S"],
                        hour: ["%H:%M:%S", "%H:%M:%S", "-%H:%M:%S"]
                    }
                }
            },
            line: {
                marker: {
                    enabled: false
                },
                lineWidth: 2,
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            }
        },
        rangeSelector: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
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
            tickInterval: 20,
            gridLineWidth: 0,
            opposite: false
        },
        xAxis: {
            type: "datetime",
            minTickInterval: 1000 * 5, // Show xAxis labels minimum every 5 second
            lineWidth: 0,
            tickLength: 0,
            ordinal: false,
            crosshair: false
        },
        tooltip: {
            borderWidth: 0,
            split: false,
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S"
            },
            valueDecimals: 2,
            shadow: false,
            borderRadius: 8,
            backgroundColor: theme.palette.background.tooltip,
            style: {
                color: "#FFFFFF"
            }
        }
    });

    const recordedSession = useRecoilValue(recordedSessionState);

    useEffect(() => {
        if (chart.current && recordedSession) {
            // For each interval in the recording, add a series to the chart
            Object.entries(recordedSession.data).forEach(([recordingId, data]) => {
                chart.current?.chart.addSeries(
                    {
                        type: "line",
                        id: recordingId,
                        name: MMDVariables[props.variable].name,
                        data: data.timestamps.map((timestamp, index) => {
                            const value = +data[props.variable][index];
                            return [timestamp, +value !== -1 ? +value.toFixed(2) : null];
                        }),
                        linkedTo: ":previous"
                    },
                    false // Do not redraw chart
                );
            });

            chart.current.chart.redraw();
        }
    }, [recordedSession]);

    return (
        <HighchartsReact highcharts={Highcharts} constructorType={"stockChart"} options={chartOptions} ref={chart} />
    );
}

export default React.memo(LineChart);
