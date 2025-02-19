import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
    Button, TextField, Select, Menu, MenuItem, FormControl, InputLabel
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";

export default function Inventory() {
    const [devices, setDevices] = useState([]);
    const [selectedDeviceType, setSelectedDeviceType] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [newDevice, setNewDevice] = useState({
        deviceName: "",
        deviceType: "",
        ipAddress: "",
        location: "",
        status: "Active",
    });

    // Fetch devices from backend
    useEffect(() => {
        fetch("http://localhost:8081/devices")
            .then((res) => res.json())
            .then((data) => setDevices(data))
            .catch((err) => console.log(err));
    }, []);

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (deviceType) => {
        setSelectedDeviceType(deviceType);
        setAnchorEl(null);
    };

    // Filter device types
    const deviceTypes = [...new Set(devices.map(device => device.deviceType))];

    // Filtered devices based on selected type
    const selectedDevices = devices.filter(
        (device) => selectedDeviceType === "" || device.deviceType === selectedDeviceType
    );

    // Handle opening and closing the add device modal
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Handle input change in form
    const handleChange = (e) => {
        setNewDevice({ ...newDevice, [e.target.name]: e.target.value });
    };

    // Handle form submission (POST request)
    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:8081/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDevice),
            });

            if (!response.ok) throw new Error("Failed to add device");

            const addedDevice = await response.json();
            setDevices([...devices, addedDevice]); // Update UI
            handleClose(); // Close modal
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Box sx={{ marginTop: 8, padding: 4, mx: "auto", width: "80%" }}>
            {/* Top Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">Device Inventory</Typography>
                <Box>
                    {/* Filter Icon */}
                    <IconButton onClick={handleFilterClick}>
                        <FilterListIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleFilterClose("")}>
                        <MenuItem onClick={() => handleFilterClose("")}>All</MenuItem>
                        {deviceTypes.map((type) => (
                            <MenuItem key={type} onClick={() => handleFilterClose(type)}>
                                {type}
                            </MenuItem>
                        ))}
                    </Menu>
                    {/* Add Device Button */}
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
                        Add Device
                    </Button>
                </Box>
            </Box>

            {/* Device Table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Device Name</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>IP Address</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedDevices.map((device, index) => (
                            <TableRow key={device.id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}>
                                <TableCell>{device.id}</TableCell>
                                <TableCell>{device.deviceName}</TableCell>
                                <TableCell>{device.deviceType}</TableCell>
                                <TableCell>{device.ipAddress}</TableCell>
                                <TableCell>{device.location}</TableCell>
                                <TableCell>{device.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Device Modal */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Device</DialogTitle>
                <DialogContent>
                    <TextField label="Device Name" name="deviceName" fullWidth margin="dense" onChange={handleChange} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Device Type</InputLabel>
                        <Select name="deviceType" value={newDevice.deviceType} onChange={handleChange} label="Device Type">
                            <MenuItem value="ROUTER">Router</MenuItem>
                            <MenuItem value="SWITCH">Switch</MenuItem>
                            <MenuItem value="FIREWALL">Firewall</MenuItem>
                            <MenuItem value="SERVER">Server</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="IP Address" name="ipAddress" fullWidth margin="dense" onChange={handleChange} />
                    <TextField label="Location" name="location" fullWidth margin="dense" onChange={handleChange} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select name="status" value={newDevice.status} onChange={handleChange} label="Status">
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
