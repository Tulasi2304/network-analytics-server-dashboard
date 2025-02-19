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
    const [data, setData] = useState(null);
    const [selectedDeviceType, setSelectedDeviceType] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8081/devices")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((err) => console.log(err));
    }, []);

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (deviceType) => {
        setSelectedDeviceType(deviceType);
        setAnchorEl(null);
    };

    const deviceTypes = [...new Set(data?.map((device) => device.deviceType))];

    const selectedDevices = data?.filter(
        (device) => selectedDeviceType === "" || device.deviceType === selectedDeviceType
    );

    let deviceHeaders = data ? Object.keys(data[0]) : [];

    return (
        <Box sx={{ marginTop: 8, padding: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography gutterBottom variant="h6">
                                Device Inventory
                            </Typography>
                            <IconButton onClick={handleFilterClick}>
                                <FilterListIcon sx={{color: "#212121"}}/>
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleFilterClose("")}>
                                <MenuItem onClick={() => handleFilterClose("")}>All</MenuItem>
                                {deviceTypes.map((type) => (
                                    <MenuItem key={type} onClick={() => handleFilterClose(type)}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#a9cff5", color: "#212121" }}>
                                    {deviceHeaders?.map((header) => (
                                        <TableCell key={header} sx={{ color: "#212121", fontWeight: "bold" }}>
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedDevices?.map((device, index) => (
                                    <TableRow key={device.id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}>
                                        {deviceHeaders?.map((header) => (
                                            <TableCell key={header}>{device[header]}</TableCell>
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
