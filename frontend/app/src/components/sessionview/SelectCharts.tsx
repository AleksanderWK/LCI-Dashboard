import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio
} from "@material-ui/core";
import {
    selectedAllSessionVariableState,
    selectedSessionActiveContainersState,
    selectedSessionIdState
} from "../../state/session";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {MMDVariables, Variable} from "../../constants";
import {selectChartsPopupOpenState} from "../../state/popup";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        btn: {
            color: theme.palette.text.default
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "1fr",
            justify: "space-between",
            gap: 18,
            color: theme.palette.text.default,
            width: "100%"
        },
        btnGroup: {
            display: "flex",
            width: "100%"
        },
        listItemText: {},
        checkbox: {
            color: theme.palette.primary.main
        }
    })
);

export default function SelectCharts(): JSX.Element {
    const classes = useStyles();
    const setPopupOpen = useSetRecoilState(selectChartsPopupOpenState);
    const [activeContainers, setActiveContainers] = useRecoilState(selectedSessionActiveContainersState);
    const selectedSession = useRecoilValue(selectedSessionIdState);
    const [selectedAllSessionVariable, setSelectedAllSessionVariable] = useRecoilState(selectedAllSessionVariableState);

    const handleCheck = (key: Variable) => () => {
        if (selectedSession != null) {
            const newContainers = {...activeContainers};
            newContainers[key] = {...activeContainers[key], active: !activeContainers[key].active};
            setActiveContainers(newContainers);
        } else {
            if (key == selectedAllSessionVariable) {
                setSelectedAllSessionVariable(null);
            } else {
                setSelectedAllSessionVariable(key);
            }
        }
    };

    const handleCheckAll = (value: boolean) => {
        const newContainers = {...activeContainers};
        Object.values(Variable).forEach((variable) => {
            newContainers[variable] = {...activeContainers[variable], active: value};
        });
        setActiveContainers(newContainers);
    };

    const checkDisabled = (variable: Variable): boolean => {
        if (selectedAllSessionVariable == null) {
            return false;
        } else if (variable == selectedAllSessionVariable) {
            return false;
        }
        return true;
    };

    return (
        <div className={classes.grid}>
            <Typography variant="h1">
                {selectedSession == null ? "Select Variable View" : "Select Variable Views"}
            </Typography>
            {selectedSession == null ? (
                <List style={{maxHeight: "400px", overflowY: "auto"}}>
                    {Object.values(Variable).map((variable, index) => {
                        const name = MMDVariables[variable].name;
                        const labelId = `radio-list-label-${name}`;
                        return (
                            <ListItem
                                key={index}
                                dense
                                button
                                onClick={handleCheck(variable)}
                                disabled={checkDisabled(variable)}
                            >
                                <ListItemIcon className={classes.checkbox}>
                                    <Radio
                                        checked={variable == selectedAllSessionVariable}
                                        tabIndex={-1}
                                        disableRipple
                                        color="primary"
                                        className={classes.checkbox}
                                        value={variable}
                                        name="radio-button-variables"
                                        inputProps={{"aria-label": name}}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    disableTypography
                                    id={labelId}
                                    primary={name}
                                    className={classes.listItemText}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <List style={{maxHeight: "400px", overflowY: "auto"}}>
                    {Object.values(Variable).map((variable, index) => {
                        const name = MMDVariables[variable].name;
                        const labelId = `checkbox-list-label-${name}`;
                        return (
                            <ListItem key={index} role={undefined} dense button onClick={handleCheck(variable)}>
                                <ListItemIcon className={classes.checkbox}>
                                    <Checkbox
                                        edge="start"
                                        checked={activeContainers[variable].active}
                                        tabIndex={-1}
                                        disableRipple
                                        color="primary"
                                        className={classes.checkbox}
                                        inputProps={{"aria-labelledby": labelId}}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    disableTypography
                                    id={labelId}
                                    primary={name}
                                    className={classes.listItemText}
                                />
                            </ListItem>
                        );
                    })}
                </List>
            )}

            <div className={classes.btnGroup}>
                {selectedSession != null &&
                    (Object.values(Variable).some((variable) => activeContainers[variable].active === false) ? (
                        <Button
                            className={classes.btn}
                            data-testid="btn-select-all"
                            onClick={() => {
                                handleCheckAll(true);
                            }}
                        >
                            <Checkbox
                                tabIndex={-1}
                                disableRipple
                                checked={false}
                                className={classes.checkbox}
                                color="primary"
                            ></Checkbox>
                            Select All
                        </Button>
                    ) : (
                        <Button
                            className={classes.btn}
                            data-testid="btn-remove-all"
                            onClick={() => {
                                handleCheckAll(false);
                            }}
                        >
                            <Checkbox
                                tabIndex={-1}
                                disableRipple
                                checked={true}
                                className={classes.checkbox}
                                color="primary"
                            ></Checkbox>
                            Remove All
                        </Button>
                    ))}
                <Button
                    className={classes.btn}
                    style={{marginLeft: "auto"}}
                    onClick={() => {
                        setPopupOpen(false);
                    }}
                >
                    Close
                </Button>
            </div>
        </div>
    );
}
