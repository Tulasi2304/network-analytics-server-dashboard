import React, { useState, useContext, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from '@mui/icons-material/BarChart';
import InventoryIcon from "@mui/icons-material/Inventory";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import Divider from "@mui/material/Divider";
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Profile from "./Profile";
import { useAuth } from "../context/UserContext";

import { Link } from "react-router-dom";

// const role = localStorage.getItem("role");

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(["width", "margin"], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    variants: [
        {
            props: ({ open }) => open,
            style: {
                ...openedMixin(theme),
                "& .MuiDrawer-paper": openedMixin(theme),
            },
        },
        {
            props: ({ open }) => !open,
            style: {
                ...closedMixin(theme),
                "& .MuiDrawer-paper": closedMixin(theme),
            },
        },
    ],
}));

export default function MiniDrawer() {
    const theme = useTheme();
    const { user } = useAuth();
    const [open, setOpen] = React.useState(true);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleProfileClick = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setProfileAnchorEl(null);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ marginRight: 2, ...(open && { display: "none" }) }}>
                            <MenuIcon />
                        </IconButton>
                        <img src="/tejas-header.png" alt="Logo" style={{ height: "70px" }} />
                    </Box>

                    {/* Profile Icon */}
                    <IconButton color="inherit" onClick={handleProfileClick}>
                        <AccountCircleIcon fontSize="large" />
                    </IconButton>

                    <Profile anchorEl={profileAnchorEl} handleClose={handleProfileClose} />
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <ListItemText primary="Menu" sx={{ display: "block", p: 2 }} />
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List sx={{ marginTop: 3 }}>
                    <ListItem disablePadding sx={{ display: "block" }}>
                        <ListItemButton component={Link} to="/home">
                            <ListItemIcon><HomeIcon /></ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ display: "block" }}>
                        <ListItemButton component={Link} to="/inventory">
                            <ListItemIcon><InventoryIcon /></ListItemIcon>
                            <ListItemText primary="Device Inventory" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ display: "block" }}>
                        <ListItemButton component={Link} to="/metrics">
                            <ListItemIcon><NetworkCheckIcon /></ListItemIcon>
                            <ListItemText primary="Metrics" />
                        </ListItemButton>
                    </ListItem>

                    {user?.role !== "VIEWER" &&
                        <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton component={Link} to="/analysis">
                                <ListItemIcon><BarChartIcon /></ListItemIcon>
                                <ListItemText primary="Analysis" />
                            </ListItemButton>
                        </ListItem>
                    }

                    {user?.role !== "VIEWER" &&
                        <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton component={Link} to="/trends">
                                <ListItemIcon><TrendingUpIcon /></ListItemIcon>
                                <ListItemText primary="Trends" />
                            </ListItemButton>
                        </ListItem>
                    }

                    <ListItem disablePadding sx={{ display: "block" }}>
                        <ListItemButton component={Link} to="/alerts">
                            <ListItemIcon><NotificationsActiveIcon /></ListItemIcon>
                            <ListItemText primary="Alerts" />
                        </ListItemButton>
                    </ListItem>

                    {user?.role === "ADMIN" &&
                        <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton component={Link} to="/users">
                                <ListItemIcon><GroupIcon /></ListItemIcon>
                                <ListItemText primary="Users" />
                            </ListItemButton>
                        </ListItem>
                    }

                    {user?.role === "ADMIN" &&
                        <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton component={Link} to="/add-user">
                                <ListItemIcon><GroupAddIcon /></ListItemIcon>
                                <ListItemText primary="Add users" />
                            </ListItemButton>
                        </ListItem>
                    }
                </List>
            </Drawer>
        </Box>
    );
}
