import React, { useState, useEffect } from "react";
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, TextField, Select, Menu, MenuItem, FormControl, InputLabel,
} from "@mui/material";
import { useAuth } from "../context/UserContext";

export default function EditDeviceForm({openEdit, handleCloseEdit, selectedDevice, setSelectedDevice, onEditDevice}) {
    const {user} = useAuth();
    const token = user.token;

    const handleUpdate = async () => {
        const response = await fetch(`http://localhost:8081/devices/admin/${selectedDevice.id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`, // Send token in Authorization header
                "Content-Type": "application/json"
            },
            body: JSON.stringify(selectedDevice),
        });
        if (response.ok) {
            onEditDevice(selectedDevice);
            handleCloseEdit();
        }
    };

    const handleEditChange = (e) => {
        setSelectedDevice({ ...selectedDevice, [e.target.name]: e.target.value });
    };

    return (
        <Dialog open={openEdit} onClose={handleCloseEdit} >
            <DialogTitle>Edit Device </DialogTitle>
            < DialogContent >
                <TextField label="Device Name" name="deviceName" fullWidth margin="dense" value={selectedDevice?.deviceName || ""
                } onChange={handleEditChange} />
                <TextField label="IP Address" name="ipAddress" fullWidth margin="dense" value={selectedDevice?.ipAddress || ""} onChange={handleEditChange} />
                <TextField label="Location" name="location" fullWidth margin="dense" value={selectedDevice?.location || ""} onChange={handleEditChange} />
                <FormControl fullWidth margin="dense" >
                    <InputLabel>Status </InputLabel>
                    < Select name="status" value={selectedDevice?.status || ""} onChange={handleEditChange} label="Status" >
                        <MenuItem value="Active" > Active </MenuItem>
                        < MenuItem value="Inactive" > Inactive </MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            < DialogActions >
                <Button onClick={handleCloseEdit}> Cancel </Button>
                < Button variant="contained" onClick={handleUpdate} > Update </Button>
            </DialogActions>
        </Dialog>
    )
}
