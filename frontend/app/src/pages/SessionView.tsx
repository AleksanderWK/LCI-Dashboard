import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import React, {useEffect} from "react";
import {useRecoilCallback, useRecoilState, useRecoilValue, useResetRecoilState} from "recoil";
import PageContainer from "../components/common/PageContainer";
import Popup from "../components/common/Popup";
import PopupContainer from "../components/common/PopupContainer";
import AddStudent from "../components/createsessionview/AddStudent";
import CreateSession from "../components/createsessionview/CreateSession";
import Dashboard from "../components/dashboard/live/Dashboard";
import Header from "../components/sessionview/Header";
import Menu from "../components/sessionview/Menu/Menu";
import QuitSession from "../components/sessionview/QuitSession";
import SelectCharts from "../components/sessionview/SelectCharts";
import {emotionsColorMapper, emotionsIndexMapper, FREQUENCY, Variable} from "../constants";
import {ipcOn, ipcSend} from "../ipc";
import {callbackFunctionsState} from "../state/chart";
import {createSessionValuesState} from "../state/createSession";
import {
    addStudentPopupOpenState,
    createSessionPopupOpenState,
    quitSessionPopupOpenState,
    selectChartsPopupOpenState
} from "../state/popup";
import {
    Data,
    EducationalSpecificEmotions,
    sessionDataState,
    sessionESEXRangeDataState,
    sessionRecordingState,
    sessionsState,
    SessionWithStudent,
    snackOpenState
} from "../state/session";

export interface DataPoints {
    [key: string]: number | EducationalSpecificEmotions;
    [Variable.CognitiveLoad]: number;
    [Variable.PerceivedDifficulty]: number;
    [Variable.Familiarity]: number;
    [Variable.InformationProcessingIndex]: number;
    [Variable.PhysiologicalArousal]: number;
    [Variable.Engagement]: number;
    [Variable.PhysiologicalStress]: number;
    [Variable.EmotionalRegulation]: number;
    [Variable.MotionStability]: number;
    [Variable.EnergySpentFatigue]: number;
    [Variable.EducationalSpecificEmotions]: EducationalSpecificEmotions;
}

export interface DataPayload {
    dataPoints: DataPoints;
    sessionCode: string;
    timestamp: number;
}

export default function SessionView(): JSX.Element {
    const [addStudentPopupOpen, setAddStudentPopupOpen] = useRecoilState(addStudentPopupOpenState);
    const [createSessionPopupOpen, setCreateSessionPopupOpen] = useRecoilState(createSessionPopupOpenState);
    const [selectChartsPopupOpen, setSelectChartsPopupOpen] = useRecoilState(selectChartsPopupOpenState);
    const [quitSessionPopupOpen, setQuitSessionPopupOpen] = useRecoilState(quitSessionPopupOpenState);

    const resetCreateSessionValues = useResetRecoilState(createSessionValuesState);

    const snackOpen = useRecoilValue(snackOpenState);

    // Adds the incoming data point to state
    const addDataPointToState = useRecoilCallback(
        ({snapshot, set}) => ({dataPoints, sessionCode, timestamp}: DataPayload) => {
            const now = Math.round(timestamp);

            // Find the Session with the same sessionCode as this data has
            const session: SessionWithStudent | undefined = snapshot
                .getLoadable(sessionsState)
                .getValue()
                .find((session) => session.sessionCode == sessionCode);

            // If we have found the session, set the data in the session state
            if (session != undefined) {
                const sessionId: number = session._id;

                // Set the data in session state
                set(sessionDataState(sessionId), (prevVal) => {
                    return (Object.fromEntries(
                        Object.entries(prevVal).map(([variable, values]) => [
                            variable,
                            [
                                ...values,
                                ...(variable == Variable.EducationalSpecificEmotions
                                    ? [[now, dataPoints[variable] as EducationalSpecificEmotions]]
                                    : []),
                                ...(variable != Variable.EducationalSpecificEmotions && +dataPoints[variable] != -1
                                    ? [[now, +((dataPoints[variable] as unknown) as number)]]
                                    : [])
                            ]
                        ])
                    ) as unknown) as Data;
                });

                computeESEXRangeData(now, dataPoints[Variable.EducationalSpecificEmotions], sessionId);

                // If this session is recording push the data to the database
                const sessionRecording = snapshot.getLoadable(sessionRecordingState(sessionId)).getValue();
                if (sessionRecording.status) {
                    ipcSend("pushDataPointToSession", {
                        timestamp: now,
                        data: dataPoints,
                        sessionId: sessionId,
                        recordingId: sessionRecording.recordingId
                    });
                }
            }
        }
    );

    // Convert raw ESE data to correct format for X-range chart and store it for session
    const computeESEXRangeData = useRecoilCallback(
        ({set}) => (timestamp: number, emotions: EducationalSpecificEmotions, sessionId: number) => {
            set(sessionESEXRangeDataState(sessionId), (prev) => {
                const data = [...prev.data];
                const emotionsIndex = {...prev.prevEmotionsIndex};

                Object.entries(emotions).forEach(([emotion, value]) => {
                    if (value) {
                        if (prev.prevEmotionsIndex[emotion] > 0) {
                            // If student already has emotion, expand last point for emotion
                            data[prev.prevEmotionsIndex[emotion]] = {
                                ...data[prev.prevEmotionsIndex[emotion]],
                                ...{x2: timestamp + 1000 / FREQUENCY}
                            };
                        } else {
                            // If student does not have emotion, add new point
                            emotionsIndex[emotion] =
                                data.push({
                                    x: timestamp,
                                    x2: timestamp + 1000 / FREQUENCY,
                                    y: emotionsIndexMapper[emotion],
                                    color: emotionsColorMapper[emotion]
                                } as Highcharts.XrangePointOptionsObject) - 1;
                        }
                    } else {
                        emotionsIndex[emotion] = 0;
                    }
                });

                return {data: data, prevEmotionsIndex: emotionsIndex};
            });
        }
    );

    // Calls every chart callback function (i.e., every update function for every active chart)
    const updateCharts = useRecoilCallback(({snapshot}) => (): void => {
        Object.values(snapshot.getLoadable(callbackFunctionsState).getValue()).forEach((callback) => {
            callback();
        });
    });

    useEffect(() => {
        ipcOn("newData", (event: any, data: DataPayload) => {
            addDataPointToState(data);
        });

        // Update all charts every 0.5s
        const updateInterval = setInterval(() => {
            updateCharts();
        }, 500);

        return () => {
            // Stop chart update interval when leaving session view
            clearInterval(updateInterval);
        };
    }, []);

    return (
        <>
            <PageContainer menu={<Menu />}>
                <>
                    <Header />
                    <Dashboard />
                </>
            </PageContainer>

            <PopupContainer
                open={createSessionPopupOpen || addStudentPopupOpen || selectChartsPopupOpen || quitSessionPopupOpen}
                onClose={(e) => {
                    if (addStudentPopupOpen) {
                        e.preventDefault();
                        setAddStudentPopupOpen(false);
                    } else if (createSessionPopupOpen) {
                        setCreateSessionPopupOpen(false);
                        setTimeout(() => {
                            resetCreateSessionValues();
                        }, 100);
                    } else if (selectChartsPopupOpen) {
                        setSelectChartsPopupOpen(false);
                    } else if (quitSessionPopupOpen) {
                        setQuitSessionPopupOpen(false);
                    }
                }}
            >
                <>
                    {quitSessionPopupOpen ? (
                        <Popup>
                            <QuitSession />
                        </Popup>
                    ) : selectChartsPopupOpen ? (
                        <Popup>
                            <SelectCharts />
                        </Popup>
                    ) : addStudentPopupOpen ? (
                        <Popup>
                            <AddStudent />
                        </Popup>
                    ) : createSessionPopupOpen ? (
                        <Popup>
                            <CreateSession />
                        </Popup>
                    ) : null}
                </>
            </PopupContainer>

            <Snackbar open={snackOpen} anchorOrigin={{vertical: "bottom", horizontal: "right"}} style={{zIndex: 2}}>
                <Alert severity="success">Recording has been saved</Alert>
            </Snackbar>
        </>
    );
}
