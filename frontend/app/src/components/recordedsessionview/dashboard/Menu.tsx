import React from "react";
import {
    createStyles,
    ListItemIcon,
    makeStyles,
    Menu as MUIMenu,
    MenuItem,
    MenuList,
    Theme,
    Typography
} from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuList: {
            padding: 0,
            color: theme.palette.text.default,
            "& .MuiListItemIcon-root": {
                minWidth: 0,
                paddingRight: theme.spacing(1)
            }
        }
    })
);

interface Props {
    open: boolean;
    anchorEl: HTMLElement | null;
    onRemoveView: () => void;
    onMenuClose: () => void;
}

/**
 * A dropdown menu for a container in the recorded session view.
 * Has a button to remove the container.
 * @param {object} props - Component props
 * @param {boolean} props.open - Whether the dropdown is open or not
 * @param {HTMLElement | null} props.anchorEl - The anchor element for the dropdown menu
 * @param {() => void} props.onRemoveView - A callback function that is called when remove view button is clicked
 * @param {() => void} props.onMenuClose - A callback function that is called dropdown menu is closed
 */
export default function Menu(props: Props): JSX.Element {
    const classes = useStyles();

    return (
        <MUIMenu
            className={"noDrag"}
            anchorEl={props.anchorEl}
            getContentAnchorEl={null}
            disableAutoFocusItem={true}
            disableScrollLock={true}
            keepMounted
            open={props.open}
            onClose={props.onMenuClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right"
            }}
            elevation={3}
            data-testid="dropdown-menu"
        >
            <MenuList dense={true} className={classes.menuList}>
                <MenuItem onClick={props.onRemoveView} aria-label="remove view">
                    <ListItemIcon>
                        <DeleteOutlinedIcon />
                    </ListItemIcon>
                    <Typography variant="inherit">Remove view</Typography>
                </MenuItem>
            </MenuList>
        </MUIMenu>
    );
}
