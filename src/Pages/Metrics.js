import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Menu, MenuItem
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function Metrics() {
    const [metrics, setMetrics] = useState([]);
    const [selectedDeviceType, setSelectedDeviceType] = useState("");
    const [selectedMetricType, setSelectedMetricType] = useState("");
    const [deviceAnchorEl, setDeviceAnchorEl] = useState(null);
    const [metricAnchorEl, setMetricAnchorEl] = useState(null);

    // Fetch metrics from backend
    useEffect(() => {
        fetch("http://localhost:8081/metrics")
            .then((res) => res.json())
            .then((data) => setMetrics(data))
            .catch((err) => console.log(err));
    }, []);

    // Extract unique device types
    const deviceTypes = [...new Set(metrics.map(metric => metric.device.deviceType))];

    // Extract unique metric types based on selected device type
    const metricTypes = selectedDeviceType
        ? [...new Set(metrics.filter(metric => metric.device.deviceType === selectedDeviceType).map(metric => metric.metricType))]
        : [];

    // Filter metrics based on selected device type and metric type
    const filteredMetrics = metrics.filter(
        (metric) =>
            (selectedDeviceType === "" || metric.device.deviceType === selectedDeviceType) &&
            (selectedMetricType === "" || metric.metricType === selectedMetricType)
    );

    return (
        <Box sx={{ marginTop: 8, padding: 4, mx: "auto", width: "80%" }}>
            {/* Top Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">Network Metrics</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {/* Device Type Filter */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mx: 5 }}>
                        <Typography variant="body1">Filter by Device Type:</Typography>
                        <IconButton onClick={(e) => setDeviceAnchorEl(e.currentTarget)}>
                            <FilterListIcon />
                        </IconButton>
                        <Menu anchorEl={deviceAnchorEl} open={Boolean(deviceAnchorEl)} onClose={() => setDeviceAnchorEl(null)}>
                            <MenuItem onClick={() => { setSelectedDeviceType(""); setSelectedMetricType(""); setDeviceAnchorEl(null); }}>All</MenuItem>
                            {deviceTypes.map((type) => (
                                <MenuItem key={type} onClick={() => { setSelectedDeviceType(type); setSelectedMetricType(""); setDeviceAnchorEl(null); }}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Menu>
                        <Typography variant="body1" fontWeight="bold">{selectedDeviceType || "All"}</Typography>
                    </Box>

                    {/* Metric Type Filter (Only enabled after selecting a device type) */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mx: 5 }}>
                        <Typography variant="body1">Filter by Metric Type:</Typography>
                        <IconButton onClick={(e) => selectedDeviceType && setMetricAnchorEl(e.currentTarget)} disabled={!selectedDeviceType}>
                            <FilterListIcon />
                        </IconButton>
                        <Menu anchorEl={metricAnchorEl} open={Boolean(metricAnchorEl)} onClose={() => setMetricAnchorEl(null)}>
                            <MenuItem onClick={() => { setSelectedMetricType(""); setMetricAnchorEl(null); }}>All</MenuItem>
                            {metricTypes.map((type) => (
                                <MenuItem key={type} onClick={() => { setSelectedMetricType(type); setMetricAnchorEl(null); }}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Menu>
                        <Typography variant="body1" fontWeight="bold">{selectedMetricType || "All"}</Typography>
                    </Box>
                </Box>
            </Box>

            {/* Metrics Table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Device ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Device Type</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Metric Type</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMetrics.map((metric, index) => (
                            <TableRow key={metric.id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}>
                                <TableCell>{metric.id}</TableCell>
                                <TableCell>{typeof metric.device === "object" ? metric.device?.id : metric.device}</TableCell>
                                <TableCell>{metric.device.deviceType}</TableCell>
                                <TableCell>{metric.metricType}</TableCell>
                                <TableCell>{metric.value}</TableCell>
                                <TableCell>{metric.timestamp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
