import React, { useState, useEffect } from "react";
import {
    Typography, Dialog, DialogActions, DialogContent, DialogTitle,
    Button
} from "@mui/material";

export default function DeleteConfirmation({openDelete, handleCloseDelete, setDevices, selectedDevice}) {
    const handleDelete = async () => {
        const response = await fetch(`http://localhost:8081/devices/${selectedDevice.id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            setDevices(prevDevices => prevDevices.filter(device => device.id !== selectedDevice.id));
            handleCloseDelete();
        }
    };
    return (
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
    )
}
