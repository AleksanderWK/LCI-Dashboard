import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, List, ListItem, ListItemIcon, ListItemText, Checkbox, Typography} from "@material-ui/core";
import {useRecoilState, useSetRecoilState} from "recoil";
import {MMDVariables, Variable} from "../../constants";
import {selectChartsPopupOpenState} from "../../state/popup";
import {selectedRecordingActiveContainersState} from "../../state/recordedSession";

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
        checkbox: {
            color: theme.palette.primary.main
        }
    })
);

/**
 * Handles selection of charts for the recorded session
 */
export default function SelectCharts(): JSX.Element {
    const classes = useStyles();
    const setPopupOpen = useSetRecoilState(selectChartsPopupOpenState);
    const [activeContainers, setActiveContainers] = useRecoilState(selectedRecordingActiveContainersState);

    /**
     * Adds or removes the given variable chart
     * @param {Variable} variable - The variable to be removed
     */
    const handleCheck = (variable: Variable) => () => {
        setActiveContainers((prevState) => {
            const list = [...prevState];
            if (list.includes(variable)) {
                list.splice(list.indexOf(variable), 1);
                return list;
            }
            list.push(variable);
            return list;
        });
    };

    /**
     * Adds or removes all of the charts
     * @param {boolean} checkAll - Whether all should be added (true) or removed (false)
     */
    const handleCheckAll = (checkAll: boolean) => {
        setActiveContainers((prevValue) => {
            return checkAll
                ? [
                      ...prevValue,
                      ...Object.values(Variable).filter(
                          (variable) => MMDVariables[variable].enabled && !prevValue.includes(variable)
                      )
                  ]
                : [];
        });
    };

    return (
        <div className={classes.grid}>
            <Typography variant="h1">Select Variables</Typography>
            <List style={{maxHeight: "400px", overflowY: "auto"}}>
                {Object.values(Variable)
                    // Variables that aren't enabled shouldn't be displayed
                    .filter((variable) => MMDVariables[variable].enabled)
                    .map((variable, index) => {
                        const name = MMDVariables[variable].name;
                        const labelId = `checkbox-list-label-${name}`;
                        // Generates checkbox and label for each variable
                        return (
                            <ListItem key={index} role={undefined} dense button onClick={handleCheck(variable)}>
                                <ListItemIcon className={classes.checkbox}>
                                    <Checkbox
                                        edge="start"
                                        checked={activeContainers.includes(variable)}
                                        tabIndex={-1}
                                        disableRipple
                                        color="primary"
                                        className={classes.checkbox}
                                        inputProps={{"aria-labelledby": labelId}}
                                    />
                                </ListItemIcon>
                                <ListItemText disableTypography id={labelId} primary={name} />
                            </ListItem>
                        );
                    })}
            </List>
            <div className={classes.btnGroup}>
                {
                    // Select all and remove all-buttons
                    Object.values(Variable).filter((variable) => MMDVariables[variable].enabled).length !=
                    activeContainers.length ? (
                        <Button
                            className={classes.btn}
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
                    )
                }
                <Button
                    className={classes.btn}
                    style={{marginLeft: "auto"}}
                    onClick={() => {
                        setPopupOpen(false);
                    }}
                >
                    Done
                </Button>
            </div>
        </div>
    );
}
