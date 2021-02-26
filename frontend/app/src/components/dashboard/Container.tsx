import React, {useState} from "react";
import {
    Card,
    CardContent,
    createStyles,
    IconButton,
    ListItemIcon,
    makeStyles,
    Menu,
    MenuItem,
    MenuList,
    SvgIcon,
    SvgIconProps,
    Theme,
    Typography
} from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import {Variable} from "../../constants";
import InfoTooltip from "./InfoTooltip";

function ResizeIcon(props: SvgIconProps): JSX.Element {
    return (
        <SvgIcon {...props}>
            <path d="M24 24H19.2V19.2H24V24ZM24 14.4H19.2V9.6H24V14.4ZM14.4 24H9.6V19.2H14.4V24ZM14.4 14.4H9.6V9.6H14.4V14.4ZM4.8 24H0V19.2H4.8V24ZM24 4.8H19.2V0H24V4.8Z" />
        </SvgIcon>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            position: "relative"
        },
        header: {
            display: "grid",
            gridTemplateColumns: "1fr 56px",
            gap: theme.spacing(2),
            marginBottom: theme.spacing(2)
        },
        menu: {
            display: "grid",
            gridTemplateColumns: "24px 24px",
            gap: theme.spacing(1)
        },
        menuList: {
            padding: 0,
            color: theme.palette.text.default,
            "& .MuiListItemIcon-root": {
                minWidth: 0,
                paddingRight: theme.spacing(1)
            }
        },
        iconButton: {
            padding: 0
        },
        resizeIcon: {
            position: "absolute",
            right: "4px",
            bottom: "4px",
            width: "10px",
            height: "10px",
            "&:hover": {
                cursor: "nw-resize"
            }
        }
    })
);

interface Props {
    variable: Variable;
}

export default function Container(props: Props): JSX.Element {
    const classes = useStyles();

    const [detailedView, setDetailedView] = useState<boolean>(true);

    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const showLess = () => {
        setDetailedView(false);
        handleMenuClose();
    };

    const showMore = () => {
        setDetailedView(true);
        handleMenuClose();
    };

    return (
        <Card variant="outlined" className={classes.card}>
            <CardContent>
                <div className={classes.header}>
                    <Typography variant="h2" noWrap={true}>
                        {props.variable}
                    </Typography>

                    <div className={classes.menu}>
                        <InfoTooltip variable={props.variable}>
                            <InfoOutlinedIcon color="action" />
                        </InfoTooltip>
                        <IconButton aria-label="settings" className={classes.iconButton} onClick={handleMenuOpen}>
                            <MoreVertIcon color="action" />
                        </IconButton>
                    </div>

                    <Menu
                        anchorEl={menuAnchorEl}
                        getContentAnchorEl={null}
                        disableAutoFocusItem={true}
                        keepMounted
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right"
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right"
                        }}
                        elevation={3}
                        transitionDuration={0}
                    >
                        <MenuList dense={true} className={classes.menuList}>
                            {detailedView ? (
                                <MenuItem onClick={showLess}>
                                    <ListItemIcon>
                                        <ZoomOutIcon />
                                    </ListItemIcon>
                                    <Typography variant="inherit">Show less</Typography>
                                </MenuItem>
                            ) : (
                                <MenuItem onClick={showMore}>
                                    <ListItemIcon>
                                        <ZoomInIcon />
                                    </ListItemIcon>
                                    <Typography variant="inherit">Show more</Typography>
                                </MenuItem>
                            )}

                            <MenuItem onClick={handleMenuClose}>
                                <ListItemIcon>
                                    <DeleteOutlinedIcon />
                                </ListItemIcon>
                                <Typography variant="inherit">Remove view</Typography>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>

                {detailedView ? <div>Insert chart component here</div> : <div>Insert value component here</div>}
            </CardContent>
            <ResizeIcon className={classes.resizeIcon} color="action" />
        </Card>
    );
}
