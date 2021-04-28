import React, {useEffect, useState} from "react";
import {makeStyles, createStyles, Theme, Fab, Typography} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/Add";
import {useHistory} from "react-router-dom";
import {ipcGet} from "../ipc";
import {useSetRecoilState} from "recoil";
import {selectedRecordedSessionIdState} from "../state/recordedSession";
import {Session} from "../state/session";
import {months} from "../constants";
import {Student, studentsState} from "../state/student";
import PageContainer from "../components/common/PageContainer";
import Logo from "../components/common/Logo";
import {duration} from "../utils/duration";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            maxWidth: 1300,
            boxShadow: "none",
            overflow: "hidden",
            padding: "0 97px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        },
        header: {
            flexShrink: 0,
            marginBottom: theme.spacing(1)
        },
        button: {
            float: "right",
            color: theme.palette.text.default,
            boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.25)",
            zIndex: 3
        },
        heading: {
            lineHeight: "40px"
        },
        container: {
            flexShrink: 1
        },
        row: {
            cursor: "pointer"
        },
        headCell: {
            color: theme.palette.text.default,
            border: "none"
        },
        cell: {
            borderStyle: "solid",
            borderColor: theme.palette.background.default,
            borderWidth: "5px 0px 5px 0px",
            color: theme.palette.text.default
        },
        pagination: {
            flexShrink: 0,
            height: "auto"
        }
    })
);

// Interface for columns in the recorded sessions table
interface Column {
    id: "id" | "sessionName" | "date" | "time" | "duration" | "studentName";
    label: string;
    format?: (value: number) => string;
}

interface Data {
    id: number;
    sessionName: string;
    date: number;
    time: number;
    duration: string;
    studentName: string;
}

// Defines the columns that are showed in the recorded sessions table
const columns: Column[] = [
    {
        id: "id",
        label: "ID"
    },
    {
        id: "sessionName",
        label: "Session Name"
    },
    {
        id: "date",
        label: "Date",
        format: (value: number) => {
            const date = new Date(value);
            return months[date.getMonth()].substr(0, 3) + " " + date.getDate() + ", " + date.getFullYear();
        }
    },
    {
        id: "time",
        label: "Time",
        format: (value: number) => {
            const date = new Date(value);
            return ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
        }
    },
    {
        id: "duration",
        label: "Duration"
    },
    {
        id: "studentName",
        label: "Student"
    }
];

export default function StartView(): JSX.Element {
    const classes = useStyles();
    const history = useHistory();

    const setSelectedRecordedSessionId = useSetRecoilState(selectedRecordedSessionIdState);

    const setStudents = useSetRecoilState(studentsState);

    const [rows, setRows] = useState<Data[]>([]);

    useEffect(() => {
        // Gets previously created students and makes them available in the dropdown
        ipcGet<Student[]>("getUsers").then((students) => {
            setStudents(students);

            // Gets the recorded sessions and inserts them into the recorded sessions table
            ipcGet<Session[]>("getRecordedSessions").then((data) => {
                setRows(
                    data.map((session) => {
                        return {
                            id: session._id,
                            sessionName: session.sessionName,
                            date: session.startTime,
                            time: session.startTime,
                            duration: session.endTime ? duration(session.startTime, session.endTime) : "undefined",
                            studentName: students.find((student) => student._id === session.studentId)?.name
                        } as Data;
                    })
                );
            });
        });
    }, []);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <PageContainer>
            <>
                <Logo absolute />
                <div className={classes.root}>
                    <div className={classes.header}>
                        <Fab
                            variant="extended"
                            size="medium"
                            color="primary"
                            aria-label="add"
                            className={classes.button}
                            onClick={() => {
                                history.push("/create-session");
                            }}
                        >
                            <AddIcon style={{marginRight: 8}} />
                            New Session
                        </Fab>
                        <Typography variant="h1" className={classes.heading}>
                            Recorded Learning Sessions
                        </Typography>
                    </div>
                    {rows.length > 0 ? (
                        <>
                            <TableContainer className={classes.container}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            {columns.map((column) => (
                                                <TableCell key={column.id} className={classes.headCell}>
                                                    {column.label}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody style={{backgroundColor: "white"}}>
                                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={row.id}
                                                    className={classes.row}
                                                    onClick={() => {
                                                        setSelectedRecordedSessionId(row.id);
                                                        history.push("/recording");
                                                    }}
                                                >
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell className={classes.cell} key={column.id}>
                                                                {column.format && typeof value === "number"
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                className={classes.pagination}
                                rowsPerPageOptions={[6, 12, 25]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </>
                    ) : (
                        <Typography>No recorded sessions.</Typography>
                    )}
                </div>
            </>
        </PageContainer>
    );
}
