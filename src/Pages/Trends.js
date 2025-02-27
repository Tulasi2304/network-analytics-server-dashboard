import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LiveGraph from "../components/LiveGraph";
import { useAuth } from "../context/UserContext";

export default function Trends() {
    const { user } = useAuth();
    const token = user.token;

    const [devices, setDevices] = useState([]);
    const [selectedDeviceType, setSelectedDeviceType] = useState("");
    const [metrics, setMetrics] = useState([]);

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
    }, []);

    useEffect(() => {
        if (!selectedDeviceType) return;

        let isMounted = true;

        const fetchMetrics = async () => {
            try {
                const response = await fetch("http://localhost:8081/metrics/viewer/stream", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (isMounted) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const rawData = decoder.decode(value);
                    console.log("Raw Stream Data:", rawData);

                    try {
                        const newMetric = JSON.parse(rawData);
                        console.log("Parsed Metric Data:", newMetric);

                        if (isMounted) {
                            setMetrics((prevMetrics) => {
                                const updatedMetrics = [...prevMetrics, newMetric].slice(-30);
                                return updatedMetrics;
                            });
                        }
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                    }
                }
            } catch (error) {
                console.error("Error fetching metrics:", error);
            }
        };

        fetchMetrics();
        return () => { isMounted = false; };
    }, [selectedDeviceType, token]);

    const handleDeviceTypeChange = (event) => {
        setSelectedDeviceType(event.target.value);
        setMetrics([]); // Reset metrics on change
    };

    const deviceTypes = [...new Set(devices?.map(device => device.deviceType))];

    // Filter metrics by selected device type
    const filteredMetrics = metrics.filter(m => m.device.deviceType === selectedDeviceType);

    // Group metrics by metric type
    const metricOrder = {
        ROUTER: ["Bandwidth", "Latency", "Packet Loss"],
        SWITCH: ["Port Utilization", "Throughput", "Error Rate"],
        FIREWALL: ["Blocked Requests", "Intrusion Attempts", "CPU Load"],
        SERVER: ["CPU Usage", "Memory Utilization", "Disk Utilization"]
    };

    // Get the predefined order for the selected device type, defaulting to an empty array
    const selectedMetricOrder = metricOrder[selectedDeviceType] || [];

    // Group metrics in an object
    const groupedMetrics = filteredMetrics.reduce((acc, metric) => {
        const { metricType, value, timestamp } = metric;
        const formattedTimestamp = new Date(timestamp).toLocaleTimeString();

        if (!acc[metricType]) acc[metricType] = { timestamps: [], values: [] };
        acc[metricType].timestamps.push(formattedTimestamp);
        acc[metricType].values.push(value);

        return acc;
    }, {});

    // Sort metrics based on predefined order
    const sortedGroupedMetrics = Object.fromEntries(
        selectedMetricOrder
            .filter(metricType => groupedMetrics[metricType]) // Ensure only present metrics are included
            .map(metricType => [metricType, groupedMetrics[metricType]])
    );


    console.log(groupedMetrics)

    return (
        <Box sx={{ marginTop: 8 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
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

            {selectedDeviceType && (
                <Grid container spacing={2} sx={{ p: 2 }}>
                    {Object.keys(sortedGroupedMetrics).map(metricType => (
                        <Grid item xs={12} md={6} lg={6} key={metricType}>
                            <Card sx={{ width: "550px", display: "flex", flexDirection: "column" }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
                                        {metricType}
                                    </Typography>
                                    <LiveGraph label={metricType} values={sortedGroupedMetrics[metricType].values} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                </Grid>
            )}
        </Box>
    );
}
