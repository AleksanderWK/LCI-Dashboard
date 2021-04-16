import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, {RefObject, useRef, useState} from "react";
import {useEffect} from "react";
import {useRecoilValue} from "recoil";
import {Variable} from "../../../constants";
import theme from "../../../theme";
import xrange from "../../../assets/xrange";
import {currentRecordingInterval, recordedSessionESEXRangeDataState} from "../../../state/recordedSession";

xrange(Highcharts);

interface Props {
    variable: Variable;
}

function XRangeChart(props: Props): JSX.Element {
    const chart = useRef<{chart: Highcharts.Chart; container: RefObject<HTMLDivElement>}>(null);

    const [chartOptions] = useState<Highcharts.Options>({
        // Initial options for chart
        chart: {
            type: "xrange"
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
                    },
                    normal: {
                        animation: false
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

    const recordedSessionESEXRangeData = useRecoilValue(recordedSessionESEXRangeDataState);
    const selectedRecordingInterval = useRecoilValue(currentRecordingInterval);

    // Listens on change in interval state and sets the x-axis' min and max values accordingly
    useEffect(() => {
        if (chart.current && selectedRecordingInterval) {
            chart.current.chart.xAxis[0].setExtremes(
                selectedRecordingInterval.start,
                selectedRecordingInterval.end,
                true // Redraw graph
            );
        }
    }, [selectedRecordingInterval]);

    useEffect(() => {
        if (chart.current && props.variable == Variable.EducationalSpecificEmotions && recordedSessionESEXRangeData) {
            chart.current.chart.series[0].setData([...recordedSessionESEXRangeData], true);
        }
    }, [recordedSessionESEXRangeData]);

    return <HighchartsReact highcharts={Highcharts} options={chartOptions} ref={chart} />;
}

export default React.memo(XRangeChart);
