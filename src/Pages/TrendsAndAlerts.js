import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Card,
    CardContent,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function Inventory() {
    const [data, setData] = useState({ devices: [], alerts: [], analysis: [] });
    const [selectedDeviceAnalysis, setSelectedDeviceAnalysis] = useState("");
    const [selectedDeviceAlerts, setSelectedDeviceAlerts] = useState("");
    const [anchorElAnalysis, setAnchorElAnalysis] = useState(null);
    const [anchorElAlerts, setAnchorElAlerts] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8081/devices")
            .then((res) => res.json())
            .then((devices) => setData((prev) => ({ ...prev, devices })))
            .catch((err) => console.error("Error fetching devices:", err));

        fetch("http://localhost:8081/analysis")
            .then((res) => res.json())
            .then((analysis) => setData((prev) => ({ ...prev, analysis })))
            .catch((err) => console.error("Error fetching analysis:", err));

        fetch("http://localhost:8081/alerts")
            .then((res) => res.json())
            .then((alerts) => setData((prev) => ({ ...prev, alerts })))
            .catch((err) => console.error("Error fetching alerts:", err));
    }, []);

    const handleFilterClick = (event, type) => {
        if (type === "analysis") setAnchorElAnalysis(event.currentTarget);
        if (type === "alerts") setAnchorElAlerts(event.currentTarget);
    };

    const handleFilterClose = (deviceId, type) => {
        if (type === "analysis") {
            setSelectedDeviceAnalysis(deviceId);
            setAnchorElAnalysis(null);
        } else if (type === "alerts") {
            setSelectedDeviceAlerts(deviceId);
            setAnchorElAlerts(null);
        }
    };

    const filteredAnalysis = data.analysis.filter((a) =>
        !selectedDeviceAnalysis || a.device.id === selectedDeviceAnalysis
    );
    const filteredAlerts = data.alerts.filter((a) =>
        !selectedDeviceAlerts || a.deviceId === selectedDeviceAlerts
    );

    const analysisHeaders = data.analysis.length > 0 ? Object.keys(data.analysis[0]) : [];
    const alertHeaders = data.alerts.length > 0 ? Object.keys(data.alerts[0]) : [];

    return (
        <Box sx={{ marginTop: 8, padding: 4, width: "100%", mx: 5 }}>
            <Grid container spacing={3}>
                {/* Analysis Results Section */}
                <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Analysis Results</Typography>
                        <IconButton onClick={(e) => handleFilterClick(e, "analysis")}> <FilterListIcon /> </IconButton>
                        <Menu anchorEl={anchorElAnalysis} open={Boolean(anchorElAnalysis)} onClose={() => handleFilterClose("", "analysis")}>
                            <MenuItem onClick={() => handleFilterClose("", "analysis")}>All</MenuItem>
                            {data.devices.map((device) => (
                                <MenuItem key={device.id} onClick={() => handleFilterClose(device.id, "analysis")}>
                                    {device.deviceName}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableRow sx={{ backgroundColor: "#a9cff5", color: "#212121" }}>
                                {analysisHeaders?.map((header) => (
                                    <TableCell key={header} sx={{ color: "#212121", fontWeight: "bold" }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableBody>
                                {filteredAnalysis.map((result, index) => (
                                    <TableRow key={result.id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}>
                                        {analysisHeaders.map((header) => (
                                            <TableCell key={header}>{typeof result[header] === "object" ? result[header]?.id : result[header]}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Alerts Section */}
                <Grid item xs={12}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">Alerts</Typography>
                        <IconButton onClick={(e) => handleFilterClick(e, "alerts")}> <FilterListIcon /> </IconButton>
                        <Menu anchorEl={anchorElAlerts} open={Boolean(anchorElAlerts)} onClose={() => handleFilterClose("", "alerts")}>
                            <MenuItem onClick={() => handleFilterClose("", "alerts")}>All</MenuItem>
                            {data.devices.map((device) => (
                                <MenuItem key={device.id} onClick={() => handleFilterClose(device.id, "alerts")}>
                                    {device.deviceName}
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableRow sx={{ backgroundColor: "#a9cff5", color: "#212121" }}>
                                {alertHeaders?.map((header) => (
                                    <TableCell key={header} sx={{ color: "#212121", fontWeight: "bold" }}>
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                            <TableBody>
                                {filteredAlerts.map((alert, index) => (
                                    <TableRow key={alert.id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}>
                                        {alertHeaders.map((header) => (
                                            <TableCell key={header}>{typeof alert[header] === "object" ? alert[header]?.id : alert[header]}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
}
