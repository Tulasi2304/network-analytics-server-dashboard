import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function AddUser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = () => {
        // Add registration logic (e.g., API call)
        console.log("User Registered: ", formData);
        navigate("/home"); // Redirect to home after successful registration
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
                Create an Account
            </Typography>
            
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, width: "350px", textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Register
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                    Fill in the details to create your account
                </Typography>

                <TextField label="Username" name="username" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Email" name="email" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Password" name="password" type="password" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                {/* <TextField label="Confirm Password" name="confirmPassword" type="password" variant="outlined" fullWidth sx={{ mb: 3 }} onChange={handleChange} /> */}
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Role</InputLabel>
                    <Select name="role" value={formData.role} onChange={handleChange} label="Role">
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="analyst">Analyst</MenuItem>
                        <MenuItem value="viewer">Viewer</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="contained" fullWidth sx={{ py: 1.2 }} onClick={handleRegister}>
                    Register
                </Button>
            </Paper>
        </Box>
    );
}
