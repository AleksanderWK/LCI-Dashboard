import {Slider, Tooltip} from "@material-ui/core";
import {makeStyles, Theme, withStyles} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import React, {ChangeEvent, useEffect} from "react";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {currentRecordingInterval, recordingInterval} from "../../state/recordedSession";

const sliderStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "300px"
        }
    })
);

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

interface Props {
    children: React.ReactElement;
    open: boolean;
    value: number;
}

const StyledTooltip = withStyles((theme: Theme) =>
    createStyles({
        tooltip: {
            margin: "6px 0",
            backgroundColor: theme.palette.background.slider,
            color: theme.palette.text.default
        }
    })
)(Tooltip);

function ValueLabelComponent(props: Props) {
    const {children, open, value} = props;

    return (
        <StyledTooltip open={open} enterTouchDelay={0} placement="top" title={value}>
            {children}
        </StyledTooltip>
    );
}

export default function IntervalSlider(): JSX.Element {
    const classes = sliderStyles();

    const setInterval = useSetRecoilState(currentRecordingInterval);
    const completeRecordingInterval = useRecoilValue(recordingInterval);

    // Update state on slider change
    const handleChange = (event: ChangeEvent<unknown>, value: number | number[]) => {
        setInterval({start: (value as number[])[0], end: (value as number[])[1]});
    };

    // Converts milliseconds to the hh:mm:ss format to display on the labels
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
