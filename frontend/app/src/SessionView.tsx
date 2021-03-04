import React, {useEffect, useState, useRef} from "react";
import Container from "./components/dashboard/Container";
import {FREQUENCY, Variable} from "./constants";
import {useSetRecoilState} from "recoil";
import {selectedStudentDataState} from "./state/data/dataAtoms";

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
        <div>
            <Container variable={Variable.PerceivedDifficulty} />
        </div>
    );
}
