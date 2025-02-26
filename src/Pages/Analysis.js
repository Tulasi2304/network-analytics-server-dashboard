import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Chart } from "react-google-charts";

import { useAuth } from "../context/UserContext";

export default function Analysis() {
    const { user } = useAuth();
    const token = user.token;

    const [devices, setDevices] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [selectedDeviceType, setSelectedDeviceType] = useState("");

    useEffect(() => {
        fetch("http://localhost:8081/devices/viewer", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            }
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errorText}`);
                }
                return res.json();
            })
            .then(setDevices)
            .catch((err) => console.error("Error fetching devices:", err));

        fetch("http://localhost:8081/metrics/viewer", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            }
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`HTTP ${res.status}: ${errorText}`);
                }
                return res.json();
            })
            .then(setMetrics)
            .catch((err) => console.error("Error fetching metrics:", err));
    }, []);

    const handleDeviceTypeChange = (event) => {
        setSelectedDeviceType(event.target.value);
    };

    const deviceTypes = [...new Set(devices?.map(device => device.deviceType))];
    const filteredDevices = devices?.filter(device => device.deviceType === selectedDeviceType);
    const filteredMetrics = metrics?.filter(metric => filteredDevices.some(device => device.id === metric.device.id));
    const metricTypes = [...new Set(filteredMetrics?.map(metric => metric.metricType))];

    const getChartData = (metricType) => {
        const timestamps = [...new Set(filteredMetrics?.map(metric => metric.timestamp))].sort();

        const chartData = [["Time", ...filteredDevices.map(device => device.deviceName)]];

        timestamps.forEach(timestamp => {
            const row = [timestamp];
            filteredDevices.forEach(device => {
                const metric = filteredMetrics.find(m => m.timestamp === timestamp && m.metricType === metricType && m.device.id === device.id);
                row.push(metric ? metric.value : 0);
            });
            chartData.push(row);
        });

        return chartData;
    };

    return (
        <Box sx={{ marginTop: 8 }}>
            <Grid container spacing={2}>
                <Grid>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2, m: 5 }}>
                        <Card sx={{ px: 5, py: 2 }}>
                            <CardContent>
                                <Typography gutterBottom variant="body1" sx={{ my: 2 }}>
                                    Select a Device Type:
                                </Typography>
                                <FormControl sx={{ minWidth: 200 }}>
                                    <InputLabel>Device Type</InputLabel>
                                    <Select value={selectedDeviceType} onChange={handleDeviceTypeChange} label="Device Type">
                                        <MenuItem value="">-- Select a Device Type --</MenuItem>
                                        {deviceTypes.map((type) => (
                                            <MenuItem key={type} value={type}>{type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>

            {/* 🔹 Render Graphs Only If a Device Type is Selected */}
            {selectedDeviceType && (
                <Grid container direction="column" spacing={2} sx={{ justifyContent: "center", textAlign: "center" }}>
                    {metricTypes.map(metricType => (
                        <Grid key={metricType} size={12} sx={{ display: "flex", width: "100%" }}>
                            <Box sx={{ width: "100%", border: "1px solid #ddd", p: 2, m: 4, borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6">{metricType} Over Time</Typography>
                                <Chart
                                    chartType="LineChart"
                                    width="1000px"
                                    height="500px"
                                    data={getChartData(metricType)}
                                    options={{
                                        hAxis: { title: "Time" },
                                        vAxis: { title: metricType },
                                        legend: { position: "bottom" }
                                    }}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
