import React, { useState } from "react";
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
import data from "../data/dummyData.json";

export default function Inventory() {
    const [selectedDeviceType, setSelectedDeviceType] = useState("");

    const handleChange = (event) => {
        setSelectedDeviceType(event.target.value);
    };

    const deviceTypes = [...new Set(data.devices.map(device => device.deviceType))];

    const selectedDevices = data.devices.filter(device => selectedDeviceType === "" || device.deviceType === selectedDeviceType);
    const selectedAnalysis = data.analysisResults.filter(result => selectedDevices.some(device => device.id === result.deviceId));
    const selectedAlerts = data.alerts.filter(alert => selectedDevices.some(device => device.id === alert.deviceId));

    const deviceHeaders = Object.keys(data.devices[0]);
    const analysisHeaders = Object.keys(data.analysisResults[0]);
    const alertHeaders = Object.keys(data.alerts[0]);

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
                    <Typography variant="h6">Device Inventory</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {deviceHeaders.map(header => (
                                        <TableCell key={header}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedDevices.map(device => (
                                    <TableRow key={device.id}>
                                        {deviceHeaders.map(header => (
                                            <TableCell key={header}>{device[header]}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="h6">Analysis Results</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {analysisHeaders.map(header => (
                                        <TableCell key={header}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedAnalysis.map(result => (
                                    <TableRow key={result.id}>
                                        {analysisHeaders.map(header => (
                                            <TableCell key={header}>{result[header]}</TableCell>
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
                                    {alertHeaders.map(header => (
                                        <TableCell key={header}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedAlerts.map(alert => (
                                    <TableRow key={alert.id}>
                                        {alertHeaders.map(header => (
                                            <TableCell key={header}>{alert[header]}</TableCell>
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
