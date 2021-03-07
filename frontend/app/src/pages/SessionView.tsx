import React, {useEffect, useRef, useState} from "react";
import Container from "../components/dashboard/Container";
import {FREQUENCY, Variable} from "../constants";
import {createStyles, makeStyles} from "@material-ui/core";
import {useRecoilState, useResetRecoilState, useSetRecoilState} from "recoil";
import {selectedSessionDataState} from "../state/data/dataAtoms";
import Menu from "../components/sessionview/Menu/Menu";
import PopupContainer from "../components/common/PopupContainer";
import AddStudent from "../components/createsessionview/AddStudent";
import CreateSession from "../components/createsessionview/CreateSession";
import {
    addStudentPopupOpenState,
    createSessionValuesState
} from "../state/CreateSessionViewState/createSessionViewAtoms";
import {createSessionPopupOpenState} from "../state/SessionViewState/SessionViewAtoms";

const useStyles = makeStyles(() =>
    createStyles({
        pageContainer: {
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "100px auto",
            gridTemplateRows: "125px auto"
        },
        header: {
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 1,
            gridRowEnd: 2
        },
        dashboard: {
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 2,
            gridRowEnd: 3
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

    const [addStudentPopupOpen, setAddStudentPopupOpen] = useRecoilState(addStudentPopupOpenState);
    const [createSessionPopupOpen, setCreateSessionPopupOpen] = useRecoilState(createSessionPopupOpenState);

    const resetCreateSessionValues = useResetRecoilState(createSessionValuesState);

    const setSelectedStudentData = useSetRecoilState(selectedSessionDataState);

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
        <>
            <div className={classes.pageContainer}>
                <Menu />
                <div className={classes.header}>header space</div>
                <div className={classes.dashboard}>
                    <Container variable={Variable.PerceivedDifficulty} />
                </div>
            </div>

            <PopupContainer
                open={createSessionPopupOpen || addStudentPopupOpen}
                onClose={(e) => {
                    if (addStudentPopupOpen) {
                        e.preventDefault();
                        setAddStudentPopupOpen(false);
                    } else if (createSessionPopupOpen) {
                        setCreateSessionPopupOpen(false);
                        setTimeout(() => {
                            resetCreateSessionValues();
                        }, 100);
                    }
                }}
            >
                {addStudentPopupOpen ? <AddStudent /> : <CreateSession />}
            </PopupContainer>
        </>
    );
}
