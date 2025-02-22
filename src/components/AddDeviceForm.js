import React, { useState, useEffect } from "react";
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, TextField, Select, Menu, MenuItem, FormControl, InputLabel,
} from "@mui/material";

export default function AddDeviceForm({ open, handleCloseAdd, onAddDevice }) {
    const [newDevice, setNewDevice] = useState({
        deviceName: "",
        deviceType: "",
        ipAddress: "",
        location: "",
        status: "Active",
    });

    const handleOpenChange = (e) => {
        setNewDevice({ ...newDevice, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        console.log(newDevice)
        try {
            const response = await fetch("http://localhost:8081/devices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDevice),
            });

            if (!response.ok) throw new Error("Failed to add device");

            const addedDevice = await response.json();
            onAddDevice(addedDevice);
            handleCloseAdd(); // Close modal
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Dialog open={open} onClose={handleCloseAdd}>
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
                <Button onClick={handleCloseAdd}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}
