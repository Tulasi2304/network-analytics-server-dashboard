import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Grid, IconButton, Button, Menu, MenuItem, Tooltip
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import AddDeviceForm from "../components/AddDeviceForm";
import DeleteConfirmation from "../components/DeleteConfirmation";
import EditDeviceForm from "../components/EditDeviceForm";

export default function Inventory() {
    const [devices, setDevices] = useState([]);
    const [selectedDeviceType, setSelectedDeviceType] = useState("");

    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);

    const [anchorEl, setAnchorEl] = useState(null);

    const role = localStorage.getItem("role");

    // Fetch devices from backend
    useEffect(() => {
        const token = localStorage.getItem("token"); // Retrieve token from local storage

        fetch("http://localhost:8081/devices/viewer", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Send JWT token
                "Content-Type": "application/json"
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch devices");
                }
                return res.json();
            })
            .then((data) => setDevices(data))
            .catch((err) => console.error("Error fetching devices:", err));
    }, []);


    //For adding device
    const handleOpenAdd = () => setOpenAdd(true);

    const handleCloseAdd = () => setOpenAdd(false);

    const handleDeviceUpdate = (addedDevice) => {
        setDevices([...devices, addedDevice]);
    };

    //For editing device
    const handleOpenEdit = (device) => {
        setSelectedDevice(device);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => setOpenEdit(false);

    const handleDeviceEdit = (device) => {
        setDevices(devices.map(d => d.id === device.id ? device : d));
    }

    //For deleting device
    const handleOpenDelete = (device) => {
        setSelectedDevice(device);
        setOpenDelete(true);
    };
    const handleCloseDelete = () => setOpenDelete(false);

    //For filtering devices
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
                    {role === "ADMIN" && (
                        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                            Add Device
                        </Button>
                    )}

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
                            {role === "ADMIN" && (
                                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                            )}

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
                                {role === "ADMIN" && (
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
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddDeviceForm open={openAdd} handleCloseAdd={handleCloseAdd} onAddDevice={handleDeviceUpdate} />

            <EditDeviceForm openEdit={openEdit} handleCloseEdit={handleCloseEdit} selectedDevice={selectedDevice} setSelectedDevice={setSelectedDevice} onEditDevice={handleDeviceEdit} />

            <DeleteConfirmation openDelete={openDelete} handleCloseDelete={handleCloseDelete} selectedDevice={selectedDevice} setDevices={setDevices} />

        </Box>
    );
}
