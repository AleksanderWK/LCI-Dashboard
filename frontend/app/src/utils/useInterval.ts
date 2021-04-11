import {useEffect, useRef} from "react";

/*
 *  An interval that takes component state into account
 */
type IntervalFunction = () => unknown | void;

export function useInterval(callback: IntervalFunction, delay: number | null): void {
    const savedCallback = useRef<IntervalFunction | null>(null);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    });

    // Set up the interval.
    useEffect(() => {
        function tick() {
            if (savedCallback.current !== null) {
                savedCallback.current();
            }
        }
        if (delay !== null) {
            const id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
