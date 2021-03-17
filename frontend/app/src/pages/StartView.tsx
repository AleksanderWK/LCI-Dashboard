import React, {useEffect, useState} from "react";
import {makeStyles, createStyles, Theme, Fab, Typography} from "@material-ui/core";
import logo from "../assets/Images/LCI_logo.png";
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
import {selectedRecordedSessionId} from "../state/recordedSession";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pageContainer: {
            width: "100%",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "30px 140px auto 140px 30px",
            gridTemplateRows: "30px auto 30px"
        },
        pageLogo: {
            gridColumnStart: 2,
            gridColumnEnd: 3,
            gridRowStart: 2,
            gridRowEnd: 3
        },
        pageContent: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            gridColumnStart: 3,
            gridColumnEnd: 4,
            gridRowStart: 2,
            gridRowEnd: 3,
            floodColor: "#ffffff"
        },
        root: {
            width: "100%",
            maxWidth: 1200,
            maxHeight: "80vh",
            minHeight: 200,
            boxShadow: "none"
        },
        header: {
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
            maxHeight: "70vh"
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
        }
    })
);

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
    duration: number;
    studentName: string;
}

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

        format: (value: number) => "-" // new Date(value).toDateString()
    },
    {
        id: "time",
        label: "Time",
        format: (value: number) => "-" // new Date(value).toLocaleTimeString("nb-NO")
    },
    {
        id: "duration",
        label: "Duration",

        format: (value: number) => "-" // (value / (1000 * 60)).toString()
    },
    {
        id: "studentName",
        label: "Student"
    }
];

export default function StartView(): JSX.Element {
    const classes = useStyles();
    const history = useHistory();

    //state management
    const setSelectedRecordedSessionId = useSetRecoilState(selectedRecordedSessionId);

    // Data creation
    function createData(
        id: number,
        sessionName: string,
        date: number,
        time: number,
        duration: number,
        studentName: string
    ): Data {
        return {id, sessionName, date, time, duration, studentName};
    }

    const [rows, setRows] = useState<Data[]>([]);

    useEffect(() => {
        ipcGet("getSessions").then((data: any) => {
            setRows(
                data.map((session: any) => {
                    return createData(
                        session._id,
                        session.sessionName,
                        1600000000000,
                        1600000000000,
                        360000,
                        session.studentName
                    );
                })
            );
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
        <div className={classes.pageContainer}>
            <img className={classes.pageLogo} src={logo} alt="The LCI-lab logo" />
            <div className={classes.pageContent}>
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
                                                        history.push("/RecordedSessionView");
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
                                style={{minHeight: "50px"}}
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
            </div>
        </div>
    );
}
