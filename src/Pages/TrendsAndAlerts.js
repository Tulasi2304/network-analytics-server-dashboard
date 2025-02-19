import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// import data from "../data/dummyData.json";

export default function Inventory() {

    const [data, setData] = useState({
        devices: [],
        alerts: [],
        analysis: []
    });

    useEffect(() => {
        fetch("http://localhost:8081/devices")  // Replace with your actual API endpoint
            .then(response => response.json())
            .then(fetcheddevices => {
                setData(prevData => ({
                    ...prevData,
                    devices: fetcheddevices || []
                }));
            })
            .catch(error => console.error("Error fetching analysis:", error));

        fetch("http://localhost:8081/analysis")  // Replace with your actual API endpoint
            .then(response => response.json())
            .then(fetchedAnalysis => {
                setData(prevData => ({
                    ...prevData,
                    analysis: fetchedAnalysis || []
                }));
            })
            .catch(error => console.error("Error fetching analysis:", error));

        fetch("http://localhost:8081/alerts")
            .then(response => response.json())
            .then(fetchedAlerts => {
                setData(prevData => ({
                    ...prevData,
                    alerts: fetchedAlerts || []
                }));
            })
            .catch(error => console.error("Error fetching alerts:", error));
    }, []);

    console.log(data);
    console.log("Fetched Analysis Data:", data.analysis[1]);
    console.log("Fetched Devices Data:", data.devices);


    const [selectedDeviceType, setSelectedDeviceType] = useState("");

    const handleChange = (event) => {
        setSelectedDeviceType(event.target.value);
    };

    const deviceTypes = [...new Set(data?.devices?.map(device => device.deviceType))];

    const selectedDevices = data?.devices?.filter(device => selectedDeviceType === "" || device.deviceType === selectedDeviceType); // for filtering
    const selectedAnalysis = data?.analysis?.filter(result => selectedDevices.some(device => device.id === result.device.id));
    const selectedAlerts = data?.alerts?.filter(alert => selectedDevices.some(device => device.id === alert.deviceId));

    console.log("Selected analysis:", selectedAnalysis)

    let analysisHeaders = data?.analysis?.length > 0 ? Object.keys(data.analysis[0]) : [];

    let alertHeaders = data?.alerts?.length > 0 ? Object.keys(data.alerts[0]) : [];

    return (
        <Box sx={{ marginTop: 8, padding: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h6">Select a Device Type:</Typography>
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Device Type</InputLabel>
                                <Select value={selectedDeviceType} onChange={handleChange} label="Device Type">
                                    <MenuItem value="">All</MenuItem>
                                    {deviceTypes.map(type => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6">Analysis Results</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {analysisHeaders?.map(header => (
                                        <TableCell key={header}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedAnalysis?.map(result => (
                                    <TableRow key={result.id}>
                                        {analysisHeaders?.map(header => (
                                            <TableCell key={header}>
                                                {typeof result[header] === "object"
                                                    ? result[header]?.id // Convert object to string
                                                    : result[header]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6">Alerts</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {alertHeaders?.map(header => (
                                        <TableCell key={header}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedAlerts?.map(alert => (
                                    <TableRow key={alert.id}>
                                        {alertHeaders?.map(header => (
                                            <TableCell key={header}>
                                                {typeof alert[header] === "object"
                                                    ? alert[header]?.id // Show device ID if it's an object
                                                    : alert[header]}
                                            </TableCell>
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
