import React from "react";
import { useNavigate } from "react-router-dom";
import { Popover, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../context/UserContext";

export default function Profile({ anchorEl, handleClose }) {
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const { user, logout } = useAuth(); // Get user from context
    // console.log("User Data:", user);


    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            logout();
            navigate("/");
        }
    };

    const handleChangePassword = () => {
        navigate("/change-password");
    };

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Box sx={{ p: 2, width: 250 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">Profile</Typography>
                    <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
                </Box>
                {user ? (
                    <>
                        <Typography variant="body1" sx={{ mt: 1 }}><strong>User Name:</strong> {user.username}</Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}><strong>Role:</strong> {user.roles[0]}</Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}><strong>Email:</strong> {user.email}</Typography>

                        <Button variant="outlined" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleChangePassword}>
                            Change Password
                        </Button>

                        <Button variant="contained" color="error" fullWidth sx={{ mt: 1 }} onClick={handleLogout}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Typography variant="body1" sx={{ mt: 1 }}>No user logged in.</Typography>
                )}
            </Box>
        </Popover>
    );
}
