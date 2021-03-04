import React, {useEffect, useRef, useState} from "react";
import Container from "../components/dashboard/Container";
import {FREQUENCY, Variable} from "../constants";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import {useSetRecoilState} from "recoil";
import {selectedStudentDataState} from "../state/data/dataAtoms";
import Header from "../components/sessionview/Header";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pageContainer: {
            backgroundColor: theme.palette.background.default,
            width: "100%",
            height: window.innerHeight,
            display: "grid",
            gridTemplateColumns: "100px 25px auto 25px",
            gridTemplateRows: "150px auto"
        },
        menu: {
            backgroundColor: "grey",
            gridColumnStart: 1,
            gridColumnEnd: 2,
            gridRowStart: 1,
            gridRowEnd: 5
        },
        header: {
            gridColumnStart: 2,
            gridColumnEnd: 4,
            gridRowStart: 1,
            gridRowEnd: 2
        },
        dashboard: {
            gridColumnStart: 3,
            gridColumnEnd: 4,
            gridRowStart: 2,
            gridRowEnd: 5
        }
    })
);

// Useless hook for interval
type IntervalFunction = () => unknown | void;

function useInterval(callback: IntervalFunction, delay: number) {
    const savedCallback = useRef<IntervalFunction | null>(null);

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            if (savedCallback.current !== null) {
                savedCallback.current();
            }
        }
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay]);
}

export default function SessionView(): JSX.Element {
    const classes = useStyles();

    const setSelectedStudentData = useSetRecoilState(selectedStudentDataState);

    // Useless logic for computing the next data point for the dummy data
    const [prevPoint, setPrevPoint] = useState<number>(50);

    const addDataPoint = () => {
        const change = [1, 0, -1];
        const dataChange = change[Math.floor(Math.random() * change.length)];

        const newPoint = prevPoint + dataChange;
        setPrevPoint(newPoint);

        // Add new data point to current selected user's data
        setSelectedStudentData((oldSelectedStudentData) => ({
            ...oldSelectedStudentData,
            [Variable.PerceivedDifficulty]: oldSelectedStudentData[Variable.PerceivedDifficulty].concat([
                [new Date().getTime(), newPoint]
            ])
        }));
    };

    useInterval(() => {
        addDataPoint();
    }, 1000 / FREQUENCY);

    return (
        <div className={classes.pageContainer}>
            <div className={classes.menu}>menu space</div>
            <div className={classes.header}>
                <Header sessionName="Educational Game" studentName="Aleksander" runtime="33m 43s" />
            </div>
            <div className={classes.dashboard}>
                <Container variable={Variable.PerceivedDifficulty} />
            </div>
        </div>
    );
}
