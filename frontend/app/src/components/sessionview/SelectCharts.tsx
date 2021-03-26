import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import {selectedSessionActiveContainersState} from "../../state/session";
import {useRecoilState} from "recoil";
import {MMDVariables, Variable} from "../../constants";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper
        }
    })
);

export default function SelectCharts(): JSX.Element {
    const classes = useStyles();
    const [activeContainers, setActiveContainers] = useRecoilState(selectedSessionActiveContainersState);

    const handleToggle = (key: Variable) => () => {
        const newContainers = {...activeContainers};
        newContainers[key] = {...activeContainers[key], active: !activeContainers[key].active};
        setActiveContainers(newContainers);
    };

    return (
        <List className={classes.root}>
            {Object.values(Variable).map((variable, index) => {
                const name = MMDVariables[variable].name;
                const labelId = `checkbox-list-label-${name}`;
                return (
                    <ListItem key={index} role={undefined} dense button onClick={handleToggle(variable)}>
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                checked={activeContainers[variable].active}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{"aria-labelledby": labelId}}
                            />
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={name} />
                    </ListItem>
                );
            })}
        </List>
    );
}
