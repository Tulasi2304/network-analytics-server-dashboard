import React, { useEffect, useState } from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, Button } from "@mui/material";
import { Chart } from "react-google-charts";
import { useAuth } from "../context/UserContext";

export default function Analysis() {
    const { user } = useAuth();
    const token = user.token;

    const [devices, setDevices] = useState([]);
    const [analysis, setAnalysis] = useState([]);
    const [selectedDeviceType, setSelectedDeviceType] = useState("");

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8081/devices/viewer", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setDevices)
            .catch(err => console.error("Error fetching devices:", err));

        fetch("http://localhost:8081/analysis/analyst", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(setAnalysis)
            .catch(err => console.error("Error fetching analysis:", err));
    }, []);

    const handleDeviceTypeChange = (event) => {
        setSelectedDeviceType(event.target.value);
    };

    const handleGenerateAndDownload = async () => {
        setIsProcessing(true);

        try {
            // Step 1: Trigger report generation
            const generateResponse = await fetch("http://localhost:8081/admin/api/reports/generate", {
                method: "GET",
                credentials: "include",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!generateResponse.ok) throw new Error("Report generation failed");

            // Step 2: Immediately trigger report download
            const downloadResponse = await fetch("http://localhost:8081/admin/api/reports/download", {
                method: "GET",
                credentials: "include",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!downloadResponse.ok) throw new Error("Report download failed");

            const blob = await downloadResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Network_Analysis_Report.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error:", error);
            alert("Error generating or downloading report. Please try again.");
        }

        setIsProcessing(false);
    };


    const deviceTypes = [...new Set(devices?.map(device => device.deviceType))];
    const filteredDevices = devices?.filter(device => device.deviceType === selectedDeviceType);
    const filteredAnalysis = analysis?.filter(a => filteredDevices.some(device => device.id === a.device.id));
    const metricTypes = [...new Set(filteredAnalysis?.map(a => a.metricType))];

    // Get the latest 3 timestamps dynamically
    const latestTimestamps = [...new Set(filteredAnalysis.map(a => a.timestamp))]
        .sort()
        .slice(-3);

    const getChartData = (metricType, valueType) => {
        const chartData = [["Device", ...latestTimestamps]];

        filteredDevices.forEach(device => {
            const row = [device.deviceName];
            latestTimestamps.forEach(timestamp => {
                const metric = filteredAnalysis.find(a => a.device.id === device.id && a.metricType === metricType && a.timestamp === timestamp);
                row.push(metric ? metric[valueType] : 0);
            });
            chartData.push(row);
        });

        return chartData;
    };

    return (
        <Box sx={{ marginTop: 8 }}>
            <Grid container justifyContent="center" sx={{ mb: 2 }}>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 2, m: 5, width: "100%" }}>
                    {user?.roles[0] === "ADMIN" &&
                        <Button variant="contained" color="primary" onClick={handleGenerateAndDownload} disabled={isProcessing}>
                            {isProcessing ? "Processing..." : "Generate & Download Report"}
                        </Button>
                    }
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
                        <Grid key={metricType} item xs={12} sx={{ display: "flex", width: "100%" }}>
                            <Box sx={{ width: "100%", border: "1px solid #ddd", p: 2, m: 4, borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6">{metricType} - Average Value</Typography>
                                <Chart
                                    chartType="LineChart"
                                    width="550px"
                                    height="450px"
                                    data={getChartData(metricType, "averageValue")}
                                    options={{
                                        hAxis: { title: "Devices" },
                                        vAxis: { title: metricType },
                                        legend: { position: "bottom" }
                                    }}
                                />
                            </Box>

                            <Box sx={{ width: "100%", border: "1px solid #ddd", p: 2, m: 4, borderRadius: 2, boxShadow: 1 }}>
                                <Typography variant="h6">{metricType} - Max Value</Typography>
                                <Chart
                                    chartType="LineChart"
                                    width="550px"
                                    height="450px"
                                    data={getChartData(metricType, "maxValue")}
                                    options={{
                                        hAxis: { title: "Devices" },
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
