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
    const [selectedDeviceType, setSelectedDeviceType] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

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

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (deviceType) => {
        setSelectedDeviceType(deviceType);
        setAnchorEl(null);
    };

    const deviceTypes = [...new Set(data.devices.map((d) => d.deviceType))];
    const filteredDevices = data.devices.filter(
        (d) => !selectedDeviceType || d.deviceType === selectedDeviceType
    );
    const filteredAnalysis = data.analysis.filter((a) =>
        filteredDevices.some((d) => d.id === a.device.id)
    );
    const filteredAlerts = data.alerts.filter((a) =>
        filteredDevices.some((d) => d.id === a.deviceId)
    );

    const analysisHeaders = data.analysis.length > 0 ? Object.keys(data.analysis[0]) : [];
    const alertHeaders = data.alerts.length > 0 ? Object.keys(data.alerts[0]) : [];

    return (
        <Box sx={{ marginTop: 8, padding: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6">Trends and Alerts</Typography>
                            <IconButton onClick={handleFilterClick}>
                                <FilterListIcon sx={{color: "#212121"}} />
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleFilterClose("")}>
                                <MenuItem onClick={() => handleFilterClose("")}>All</MenuItem>
                                {deviceTypes.map((type) => (
                                    <MenuItem key={type} onClick={() => handleFilterClose(type)}>{type}</MenuItem>
                                ))}
                            </Menu>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6" sx={{m: 1}}>Analysis Results</Typography>
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

                <Grid item xs={12}>
                    <Typography variant="h6" sx={{m: 1}}>Alerts</Typography>
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
