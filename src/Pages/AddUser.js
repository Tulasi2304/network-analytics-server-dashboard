import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import * as XLSX from "xlsx";

export default function AddUser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "", role: "" });
    
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const response = await fetch("http://localhost:8081/users/upload", {
                method: "POST",
                body: formData
            });
    
            if (!response.ok) {
                throw new Error("Failed to upload file");
            }
    
            const result = await response.json();
            console.log("File uploaded successfully: ", result);
            alert("File uploaded successfully!");
    
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };
    
    
    const handleRegister = async () => {
        try {
            const response = await fetch("http://localhost:8081/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error("Failed to register user");
            }
            // console.log(response)
            const result = await response.json();
            console.log("User Registered: ", result);
            navigate("/add-user");
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };
    
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f4f6f8", mx: "auto" }}>
            <img src="/tejas-header.png" alt="Logo" style={{ width: "200px", marginBottom: "10px" }} />
            
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>Create an Account</Typography>
            
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, width: "350px", textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Register</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>Fill in the details to create your account</Typography>
                
                <TextField label="Username" name="username" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Email" name="email" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                <TextField label="Password" name="password" type="password" variant="outlined" fullWidth sx={{ mb: 2 }} onChange={handleChange} />
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Role</InputLabel>
                    <Select name="role" value={formData.role} onChange={handleChange} label="Role">
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="analyst">Analyst</MenuItem>
                        <MenuItem value="viewer">Viewer</MenuItem>
                    </Select>
                </FormControl>
                
                <Typography align="center" sx={{fontSize: 14, fontWeight: 500, color: "gray" }}>or</Typography>
                <Button variant="contained" component="label" fullWidth sx={{ mt: 1, py: 1.5, borderRadius: 2, backgroundColor: "#1976d2", color: "white", '&:hover': { backgroundColor: "#1565c0" }}}>
                    Upload Excel File
                    <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
                </Button>
                
                <Button variant="contained" fullWidth sx={{ py: 1.2, mt: 2 }} onClick={handleRegister}>Register</Button>
            </Paper>
        </Box>
    );
}
