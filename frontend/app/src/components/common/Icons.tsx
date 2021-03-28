import React from "react";
import {SvgIcon, SvgIconProps} from "@material-ui/core";

export function AddChartIcon(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props} viewBox="3 3 29 29">
            <path
                d="M33 7.5V10.5H28.5V15H25.5V10.5H21V7.5H25.5V3H28.5V7.5H33ZM28.5 28.5H7.5V7.5H16.5V4.5H7.5C5.85 4.5 4.5 5.85 4.5 7.5V28.5C4.5 30.15 5.85 31.5 7.5 31.5H28.5C30.15 31.5 31.5 30.15 31.5 28.5V19.5H28.5V28.5ZM22.5 19.5V25.5H25.5V19.5H22.5ZM16.5 25.5H19.5V13.5H16.5V25.5ZM13.5 25.5V16.5H10.5V25.5H13.5Z"
                fill="#535353"
            />
        </SvgIcon>
    );
}

export function ExitIcon(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props} viewBox="3 3 29 29">
            <path
                d="M15.135 23.385L17.25 25.5L24.75 18L17.25 10.5L15.135 12.615L19.005 16.5H4.5V19.5H19.005L15.135 23.385ZM28.5 4.5H7.5C5.835 4.5 4.5 5.85 4.5 7.5V13.5H7.5V7.5H28.5V28.5H7.5V22.5H4.5V28.5C4.5 30.15 5.835 31.5 7.5 31.5H28.5C30.15 31.5 31.5 30.15 31.5 28.5V7.5C31.5 5.85 30.15 4.5 28.5 4.5Z"
                fill="#535353"
            />
        </SvgIcon>
    );
}

export function CloseIcon(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props} viewBox="0 0 29 29">
            <path
                d="M17.9408 8.55L14.25 12.2408L10.5592 8.55L8.55 10.5592L12.2408 14.25L8.55 17.9408L10.5592 19.95L14.25 16.2592L17.9408 19.95L19.95 17.9408L16.2592 14.25L19.95 10.5592L17.9408 8.55ZM14.25 0C6.36975 0 0 6.36975 0 14.25C0 22.1302 6.36975 28.5 14.25 28.5C22.1302 28.5 28.5 22.1302 28.5 14.25C28.5 6.36975 22.1302 0 14.25 0ZM14.25 25.65C7.96575 25.65 2.85 20.5343 2.85 14.25C2.85 7.96575 7.96575 2.85 14.25 2.85C20.5343 2.85 25.65 7.96575 25.65 14.25C25.65 20.5343 20.5343 25.65 14.25 25.65Z"
                fill="#535353"
            />
        </SvgIcon>
    );
}
