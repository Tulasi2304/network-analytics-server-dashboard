import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Menu, MenuItem
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function Metrics() {
    const [metrics, setMetrics] = useState([]);
    const [selectedMetricType, setSelectedMetricType] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    // Fetch metrics from backend
    useEffect(() => {
        fetch("http://localhost:8081/metrics")
            .then((res) => res.json())
            .then((data) => setMetrics(data))
            .catch((err) => console.log(err));
    }, []);

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (metricType) => {
        setSelectedMetricType(metricType);
        setAnchorEl(null);
    };

    // Extract unique metric types
    const metricTypes = [...new Set(metrics.map(metric => metric.metricType))];

    // Filter metrics based on selected type
    const filteredMetrics = metrics.filter(
        (metric) => selectedMetricType === "" || metric.metricType === selectedMetricType
    );

    return (
        <Box sx={{ marginTop: 8, padding: 4, mx: "auto", width: "80%" }}>
            {/* Top Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">Network Metrics</Typography>
                <Box>
                    {/* Filter Icon */}
                    <IconButton onClick={handleFilterClick}>
                        <FilterListIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleFilterClose("")}>
                        <MenuItem onClick={() => handleFilterClose("")}>All</MenuItem>
                        {metricTypes.map((type) => (
                            <MenuItem key={type} onClick={() => handleFilterClose(type)}>
                                {type}
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Box>

            {/* Metrics Table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Device ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Metric Type</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMetrics.map((metric, index) => (
                            <TableRow key={metric.id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}>
                                <TableCell>{metric.id}</TableCell>
                                <TableCell>
                                    {typeof metric.device === "object" ? metric.device?.id : metric.device}
                                </TableCell>
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
