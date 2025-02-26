import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Box, TextField, Button, Typography, Container, Card, CardContent, Alert,} from "@mui/material";
import { useAuth } from "../context/UserContext";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const {user} = useAuth();
    const username = user.username;
    
    const token = user.token;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
    
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
    
        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        // Send request to backend
        fetch("http://localhost:8081/auth/updatepassword", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ username, newPassword }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                setSuccess("Password changed successfully!");
                
                // setTimeout(() => {
                //     navigate("/home");
                // }, 1500);
                
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                navigate("/home");
            } else {
                setError(data.message || "Error changing password.");
            }
            setTimeout(() => {
                navigate("/home");
            }, 1500);
        })
        .catch(() => setError("Server error. Please try again later."));
    };
    

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 15, display: "flex", justifyContent: "center" }}>
                <Card elevation={3} sx={{ borderRadius: 4, p: 3, width: "100%", maxWidth: 400 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Change Password
                        </Typography>

                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <TextField fullWidth label="Old Password" type="password" margin="normal" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required/>
                            <TextField fullWidth label="New Password" type="password" margin="normal" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
                            <TextField fullWidth label="Confirm New Password" type="password" margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>

                            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Change Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
