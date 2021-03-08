import React from "react";
import {makeStyles, createStyles, Theme, Button} from "@material-ui/core";
import logo from "../assets/Images/LCI_logo.png";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pageContainer: {
            width: "100%",
            height: window.innerHeight,
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
        illustration: {
            width: "400px",
            height: "400px",
            marginLeft: "100px"
        },
        root: {
            width: "70%",
            maxHeight: "80vh",
            minHeight: 200,
            boxShadow: "none",
            backgroundColor: theme.palette.background.default
        },
        container: {
            maxHeight: "70vh",
            boxShadow: "none"
        },
        row: {
            padding: 16,
            borderStyle: "solid",
            borderColor: theme.palette.background.default,
            borderWidth: "5px 0px 5px 0px",
            cursor: "pointer"
        }
    })
);

export default function StartView(): JSX.Element {
    const classes = useStyles();

    interface Column {
        id: "id" | "sessionName" | "date" | "startTime" | "duration" | "studentName";
        label: string;
        minWidth?: number;
        align?: "right" | "center" | "left";
        format?: (value: number) => string;
    }

    interface Data {
        id: number;
        sessionName: string;
        date: number;
        startTime: number;
        duration: number;
        studentName: string;
    }

    const columns: Column[] = [
        {
            id: "id",
            label: "ID",
            minWidth: 5,
            align: "right"
        },
        {
            id: "sessionName",
            label: "Session\u00a0Name",
            minWidth: 10,
            align: "right"
        },
        {
            id: "date",
            label: "Date",
            minWidth: 40,
            align: "right",
            format: (value: number) => new Date(value).toDateString()
        },
        {
            id: "startTime",
            label: "Start\u00a0Time",
            minWidth: 30,
            align: "right",
            format: (value: number) => new Date(value).toLocaleTimeString("nb-NO")
        },
        {
            id: "duration",
            label: "Duration",
            minWidth: 10,
            align: "right",
            format: (value: number) => (value / (1000 * 60)).toString()
        },
        {
            id: "studentName",
            label: "Student",
            minWidth: 10,
            align: "right"
        }
    ];

    //Example data creation
    function createData(
        id: number,
        sessionName: string,
        date: number,
        startTime: number,
        duration: number,
        studentName: string
    ): Data {
        return {id, sessionName, date, startTime, duration, studentName};
    }

    const rows = [
        createData(1, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(2, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(3, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(4, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(5, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(6, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(7, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(8, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(9, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(10, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(11, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(12, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(13, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(14, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(15, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(16, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(17, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend"),
        createData(18, "Edugame", 1600000000000, 1600000000000, 360000, "Erlend")
    ];

    // Pagination
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(6);

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
                <Paper className={classes.root}>
                    <div>
                        <Button
                            className="headerHeader"
                            variant="contained"
                            color="primary"
                            style={{float: "right", borderRadius: 20, marginBottom: 20}}
                            href="/createSession"
                        >
                            <AddIcon style={{paddingRight: 10}} />
                            New session
                        </Button>
                        <h3>Recorded learning sessions</h3>
                    </div>
                    <TableContainer className={classes.container}>
                        <Table className="headerHeader" stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth: column.minWidth,
                                                padding: 8,
                                                border: "none"
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody style={{backgroundColor: "white"}}>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell
                                                        className={classes.row}
                                                        key={column.id}
                                                        align={column.align}
                                                    >
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
                </Paper>
            </div>
        </div>
    );
}
