import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle,
    Button, TextField, Select, Menu, MenuItem, FormControl, InputLabel, Tooltip
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Inventory() {
    const [devices, setDevices] = useState([]);
    const [selectedDeviceType, setSelectedDeviceType] = useState("");
    
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);
    
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

    const handleOpenEdit = (device) => {
        setSelectedDevice(device);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => setOpenEdit(false);

    const handleOpenDelete = (device) => {
        setSelectedDevice(device);
        setOpenDelete(true);
    };
    const handleCloseDelete = () => setOpenDelete(false);

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
    const handleOpen = () => setOpenAdd(true);
    const handleClose = () => setOpenAdd(false);

    // Handle input change in form
    const handleOpenChange = (e) => {
        setNewDevice({ ...newDevice, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setSelectedDevice({ ...selectedDevice, [e.target.name]: e.target.value });
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

    const handleUpdate = async () => {
        const response = await fetch(`http://localhost:8081/devices/${selectedDevice.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedDevice),
        });
        if (response.ok) {
            setDevices(devices.map(d => d.id === selectedDevice.id ? selectedDevice : d));
            handleCloseEdit();
        }
    };

    const handleDelete = async () => {
        const response = await fetch(`http://localhost:8081/devices/${selectedDevice.id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            setDevices(devices.filter(d => d.id !== selectedDevice.id));
            handleCloseDelete();
        }
    };

    return (
        <Box sx={{ marginTop: 8, padding: 4, mx: "auto", width: "80%" }}>
            {/* Top Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">Device Inventory</Typography>
                <Box>
                    {/* Filter Icon */}
                    <IconButton onClick={handleFilterClick} sx={{ mx: 2 }}>
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
                            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
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
                                <TableCell align="center">
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => handleOpenEdit(device)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleOpenDelete(device)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Device Modal */}
            <Dialog open={openAdd} onClose={handleClose}>
                <DialogTitle>Add New Device</DialogTitle>
                <DialogContent>
                    <TextField label="Device Name" name="deviceName" fullWidth margin="dense" onChange={handleOpenChange} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Device Type</InputLabel>
                        <Select name="deviceType" value={newDevice.deviceType} onChange={handleOpenChange} label="Device Type">
                            <MenuItem value="ROUTER">Router</MenuItem>
                            <MenuItem value="SWITCH">Switch</MenuItem>
                            <MenuItem value="FIREWALL">Firewall</MenuItem>
                            <MenuItem value="SERVER">Server</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="IP Address" name="ipAddress" fullWidth margin="dense" onChange={handleOpenChange} />
                    <TextField label="Location" name="location" fullWidth margin="dense" onChange={handleOpenChange} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select name="status" value={newDevice.status} onChange={handleOpenChange} label="Status">
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

            {/* Edit Device Modal */}
            <Dialog open={openEdit} onClose={handleCloseEdit}>
                <DialogTitle>Edit Device</DialogTitle>
                <DialogContent>
                    <TextField label="Device Name" name="deviceName" fullWidth margin="dense" value={selectedDevice?.deviceName || ""} onChange={handleEditChange} />
                    <TextField label="IP Address" name="ipAddress" fullWidth margin="dense" value={selectedDevice?.ipAddress || ""} onChange={handleEditChange} />
                    <TextField label="Location" name="location" fullWidth margin="dense" value={selectedDevice?.location || ""} onChange={handleEditChange} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select name="status" value={selectedDevice?.status || ""} onChange={handleEditChange} label="Status">
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit}>Cancel</Button>
                    <Button variant="contained" onClick={handleUpdate}>Update</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={openDelete} onClose={handleCloseDelete}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete <strong>{selectedDevice?.deviceName}</strong>?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
