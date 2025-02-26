import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useAuth } from "../context/UserContext";

export default function AddUser({ onAddUser }) { // Accept onAddUser as a prop
    const navigate = useNavigate();
    const { user } = useAuth();
    const token = user?.token;
    
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        try {
            const response = await fetch("http://localhost:8081/admin/upload-users", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: uploadFormData
            });

            if (!response.ok) throw new Error("Failed to upload file");

            const uploadedUsers = await response.json();
            if (onAddUser) {
                uploadedUsers.forEach(user => onAddUser(user)); // Update UI with new users
            }
            alert("Users uploaded successfully!");
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleRegister = async () => {
        try {
            const response = await fetch("http://localhost:8081/admin/adduser", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Failed to register user");

            const result = await response.json();
            console.log("User Registered: ", result);
            navigate("/home");
        } catch (error) {
            console.error("Error registering user:", error);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f4f6f8", mx: "auto", mt: 5 }}>
            
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, width: "350px", textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Create an account</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>Fill in the details to create an account</Typography>
                
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
