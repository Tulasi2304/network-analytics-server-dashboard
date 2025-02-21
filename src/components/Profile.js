import React from "react";
import { useNavigate } from "react-router-dom";
import { Popover, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Profile({ anchorEl, handleClose }) {
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    const user = {
        name: "John Doe",
        role: "Admin",
        email: "john.doe@example.com",
    };

    const handleLogout = () => {
        navigate("/"); // Redirect to login page
    };

    const handleChangePassword = () => {
        navigate("/change-password"); // Navigate to change password page
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <Box sx={{ p: 2, width: 250 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">Profile</Typography>
                    <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}><strong>Name:</strong> {user.name}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}><strong>Role:</strong> {user.role}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}><strong>Email:</strong> {user.email}</Typography>

                <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleChangePassword}>
                    Change Password
                </Button>

                <Button variant="contained" color="error" fullWidth sx={{ mt: 1 }} onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
        </Popover>
    );
}
