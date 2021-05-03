import {useEffect, useRef} from "react";

type IntervalFunction = () => unknown | void;

/**
 * An interval that takes component state into account
 * @param callback - The function to be called on every interval
 * @param delay - The delay in the interval
 */
export function useInterval(callback: IntervalFunction, delay: number | null): void {
    const savedCallback = useRef<IntervalFunction | null>(null);

    // Remember the latest callback
    useEffect(() => {
        savedCallback.current = callback;
    });

    // Set up the interval
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
