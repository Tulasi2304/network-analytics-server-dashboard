import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Card,
    CardContent,
    Alert,
} from "@mui/material";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
        fetch("http://localhost:8081/auth/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                oldPassword,
                newPassword,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setSuccess("Password changed successfully!");
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                } else {
                    setError(data.message || "Error changing password.");
                }
            })
            .catch(() => setError("Server error. Please try again later."));
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Change Password
                        </Typography>

                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Old Password"
                                type="password"
                                margin="normal"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                margin="normal"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                margin="normal"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Change Password
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
