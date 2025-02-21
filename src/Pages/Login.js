import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Here, you can add authentication logic
        navigate("/home"); // Redirect to home after login
    };

    return (
        <Box 
            sx={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                height: "100vh", 
                backgroundColor: "#f4f6f8" 
            }}
        >
            <img src="/tejas-header.png" alt="Logo" style={{ width: "200px", marginBottom: "10px" }} />

            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                Network Metrics Analysis Server
            </Typography>
            
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, width: "350px", textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Welcome Back
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Please enter your credentials to continue
                </Typography>

                <TextField label="Username" variant="outlined" fullWidth sx={{ mb: 2 }} />

                <TextField label="Password" type="password" variant="outlined" fullWidth sx={{ mb: 3 }} />
                
                <Button variant="contained" fullWidth sx={{ py: 1.2 }} onClick={handleLogin}>
                    Login
                </Button>
            </Paper>
        </Box>
    );
}
