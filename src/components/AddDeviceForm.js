import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import { useAuth } from "../context/UserContext";

export default function AddDeviceForm({ open, handleCloseAdd, onAddDevice }) {
    const { user } = useAuth();
    const token = user.token;
    const [newDevice, setNewDevice] = useState({ deviceName: "", deviceType: "", ipAddress: "", location: "", status: "Active" });

    const handleOpenChange = (e) => setNewDevice({ ...newDevice, [e.target.name]: e.target.value });

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const response = await fetch("http://localhost:8081/devices/admin/uploadExcel", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}` // Only include authorization, no need for "Content-Type" in FormData
                },
                body: formData
            });
    
            if (!response.ok) throw new Error("Failed to upload file");
            
            const uploadedDevices = await response.json();
            uploadedDevices.forEach(device => onAddDevice(device)); // Assuming backend returns an array of added devices
            handleCloseAdd();
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };
    

    const handleSubmit = async () => {
        try {
            const response = await fetch("http://localhost:8081/devices/admin", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`, // Send token in Authorization header
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newDevice)
            });
            if (!response.ok) throw new Error("Failed to add device");
            const addedDevice = await response.json();
            onAddDevice(addedDevice);
            handleCloseAdd();
        } catch (error) { console.error("Error:", error); }
    };

    return (
        <Dialog open={open} onClose={handleCloseAdd} sx={{ ".MuiDialog-paper": { borderRadius: 3 } }}>
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
                <Typography align="center" sx={{ my: 2, fontSize: 14, fontWeight: 500, color: "gray" }}>or</Typography>
                <Button variant="contained" component="label" sx={{ mt: 1, py: 1.5, px: 3, borderRadius: 2, backgroundColor: "#1976d2", color: "white", width: "40%", display: "block", mx: "auto", '&:hover': { backgroundColor: "#1565c0" }, textAlign: "center" }}>
                    Upload Excel File
                    <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseAdd}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
}
