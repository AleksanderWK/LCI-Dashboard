import {Slider, Tooltip} from "@material-ui/core";
import {makeStyles, Theme, withStyles} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import React, {ChangeEvent} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {currentRecordingInterval, recordingInterval} from "../../state/recordedSession";

const sliderStyles = makeStyles(() =>
    createStyles({
        root: {
            paddingTop: "10px",
            width: "75%"
        }
    })
);

/**
 * A custom styled slider
 */
const CustomSlider = withStyles((theme: Theme) =>
    createStyles({
        thumb: {
            height: 20,
            width: 20,
            marginTop: -7,
            marginLeft: -12,
            "&:hover": {
                boxShadow: "0px 0px 0px 0px rgba(250,166 ,16 , 0.16)"
            },
            "&:focus-visible": {
                boxShadow: "0px 0px 0px 0px rgba(250,166 ,16 , 0.16)"
            }
        },

        valueLabel: {
            left: "calc(-50% + 4px)"
        },
        track: {
            height: 6,
            borderRadius: 4
        },
        rail: {
            height: 6,
            backgroundColor: theme.palette.background.slider,
            borderRadius: 4
        }
    })
)(Slider);

/**
 * A custom styled tooltip
 */
const StyledTooltip = withStyles((theme: Theme) =>
    createStyles({
        tooltip: {
            margin: "6px 0",
            backgroundColor: theme.palette.background.slider,
            color: theme.palette.text.default
        }
    })
)(Tooltip);

interface Props {
    children: React.ReactElement;
    open: boolean;
    value: number;
}

/**
 * The value shown above a thumb on the slider
 * @param {object} props - Component props
 * @param {React.ReactElement} props.children - The content of the value label component
 * @param {boolean} props.open - Whether the value label component is shown or not
 * @param {number} props.value - Value to be displayed in tooltip
 */
function ValueLabelComponent(props: Props) {
    const {children, open, value} = props;

    return (
        <StyledTooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </StyledTooltip>
    );
}

/**
 * A slider for selecting an interval to view the data for
 */
export default function IntervalSlider(): JSX.Element {
    const classes = sliderStyles();

    const setInterval = useSetRecoilState(currentRecordingInterval);
    const completeRecordingInterval = useRecoilValue(recordingInterval);

    /**
     * Update state on slider change
     * @param {ChangeEvent} event - The change event
     * @param {number | number[]} value - The new value(s) of the slider
     */
    const handleChange = (event: ChangeEvent<unknown>, value: number | number[]) => {
        setInterval({start: (value as number[])[0], end: (value as number[])[1]});
    };

    /**
     * Converts milliseconds to the hh:mm:ss format to display on the labels
     * @param value - Milliseconds
     * @returns A string representation with format hh:mm:ss
     */
    function valuetext(value: number) {
        const d = new Date(value);
        return `${("0" + d.getHours()).slice(-2)}:${("0" + d.getMinutes()).slice(-2)}:${("0" + d.getSeconds()).slice(
            -2
        )}`;
    }

    return (
        <div className={classes.root}>
            {completeRecordingInterval && (
                <CustomSlider
                    valueLabelDisplay="on"
                    key={`slider-${[completeRecordingInterval.start, completeRecordingInterval.end]}`}
                    defaultValue={[completeRecordingInterval.start, completeRecordingInterval.end]}
                    min={completeRecordingInterval.start}
                    max={completeRecordingInterval.end}
                    valueLabelFormat={valuetext}
                    onChangeCommitted={handleChange}
                    ValueLabelComponent={ValueLabelComponent}
                />
            )}
        </div>
    );
}
