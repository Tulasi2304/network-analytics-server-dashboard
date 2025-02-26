import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Menu, MenuItem
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function Alerts() {
    const [devices, setDevices] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8081/devices/viewer", {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(setDevices)
        .catch(err => console.error("Error fetching devices:", err));

        fetch("http://localhost:8081/alerts/viewer", {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(setAlerts)
        .catch(err => console.error("Error fetching alerts:", err));
    }, []);

    const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
    const handleFilterClose = (deviceId) => {
        setSelectedDevice(deviceId);
        setAnchorEl(null);
    };

    const filteredAlerts = alerts.filter(a => !selectedDevice || a.deviceId === selectedDevice);
    const alertHeaders = alerts.length > 0 ? Object.keys(alerts[0]) : [];

    return (
        <Box sx={{ marginTop: 8, padding: 4, width: "100%", mx: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Alerts</Typography>
                <IconButton onClick={handleFilterClick}> <FilterListIcon /> </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleFilterClose("")}>
                    <MenuItem onClick={() => handleFilterClose("")}>All</MenuItem>
                    {devices.map(device => (
                        <MenuItem key={device.id} onClick={() => handleFilterClose(device.id)}>
                            {device.deviceName}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                            {alertHeaders.map(header => (
                                <TableCell key={header} sx={{ fontWeight: "bold" }}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAlerts.map((alert, index) => (
                            <TableRow key={alert.id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}>
                                {alertHeaders.map(header => (
                                    <TableCell key={header}>
                                        {typeof alert[header] === "object" ? alert[header]?.id : alert[header]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
