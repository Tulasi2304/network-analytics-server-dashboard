import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, IconButton, Menu, MenuItem
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useAuth } from "../context/UserContext";

export default function Trends() {
    const [devices, setDevices] = useState([]);
    const [analysis, setAnalysis] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const { user } = useAuth();
    const token = user.token;

    useEffect(() => {
        fetch("http://localhost:8081/devices/viewer", {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(setDevices)
        .catch(err => console.error("Error fetching devices:", err));

        fetch("http://localhost:8081/analysis/analyst", {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(setAnalysis)
        .catch(err => console.error("Error fetching analysis:", err));
    }, []);

    const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
    const handleFilterClose = (deviceId) => {
        setSelectedDevice(deviceId);
        setAnchorEl(null);
    };

    const filteredAnalysis = analysis.filter(a => !selectedDevice || a.device.id === selectedDevice);
    const analysisHeaders = analysis.length > 0 ? Object.keys(analysis[0]) : [];

    return (
        <Box sx={{ marginTop: 8, padding: 4, width: "100%", mx: 5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Analysis Results</Typography>
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
                            {analysisHeaders.map(header => (
                                <TableCell key={header} sx={{ fontWeight: "bold" }}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAnalysis.map((result, index) => (
                            <TableRow key={result.id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}>
                                {analysisHeaders.map(header => (
                                    <TableCell key={header}>
                                        {typeof result[header] === "object" ? result[header]?.id : result[header]}
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
