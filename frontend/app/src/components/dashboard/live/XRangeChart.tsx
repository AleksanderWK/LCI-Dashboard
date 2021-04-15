import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, {RefObject, useRef, useState} from "react";
import {useEffect} from "react";
import {useRecoilCallback, useRecoilValue} from "recoil";
import {FREQUENCY, LIVE_CHART_RANGE, Variable} from "../../../constants";
import {
    selectedSessionActiveContainersState,
    selectedSessionDataState,
    selectedSessionESEXRangeDataState,
    sessionDataState,
    sessionESEXRangeDataState
} from "../../../state/session";
import theme from "../../../theme";
import xrange from "../../../assets/xrange";
import {useChartCallbacks} from "../../../utils/useChartCallbacks";

xrange(Highcharts);

interface Props {
    variable: Variable;
    id?: number;
}

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
                },
                redraw: () => {
                    console.log("redraw");
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

    const updateChart = useRecoilCallback(({snapshot}) => (animationDuration: number) => {
        if (chart.current) {
            const rawData = props.id
                ? [...snapshot.getLoadable(sessionDataState(props.id)).getValue()[props.variable]]
                : [...snapshot.getLoadable(selectedSessionDataState).getValue()[props.variable]];

            const processedData = props.id
                ? [...snapshot.getLoadable(sessionESEXRangeDataState(props.id)).getValue().data]
                : [...snapshot.getLoadable(selectedSessionESEXRangeDataState).getValue().data];

            chart.current.chart.series[0].setData(processedData, false);

            if (rawData.length > 0) {
                chart.current.chart.xAxis[0].setExtremes(
                    rawData.length >= FREQUENCY * LIVE_CHART_RANGE
                        ? rawData.slice(-(FREQUENCY * LIVE_CHART_RANGE))[0][0]
                        : undefined,
                    rawData[rawData.length - 1][0],
                    false
                );
            }

            chart.current.chart.redraw({duration: animationDuration});
        }
    });

    useEffect(() => {
        if (chartId) {
            // Update chart on component mount
            updateChart(0);

            return () => {
                // Remove update callback function on unmount
                if (chartId) {
                    removeCallback(chartId);
                }
            };
        }
    }, [chartId]);

    const activeContainers = useRecoilValue(selectedSessionActiveContainersState);

    useEffect(() => {
        // If active containers is changed, reflow graph as container size may have changed
        if (chart.current) {
            chart.current.chart.reflow();
        }
    }, [activeContainers]);

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chart} />;
}

export default React.memo(XRangeChart);
