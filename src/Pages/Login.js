import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useAuth } from "../context/UserContext";

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        setError("");

        try {
            const response = await fetch("http://localhost:8081/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
                credentials: "include",
            });

            const data = await response.json();
            console.log("Login Response:", data); // 🔍 Debugging response

            if (!response.ok) {
                throw new Error(data.error || "Invalid credentials");
            }

            if (!data.token) {
                throw new Error("Token not received from server");
            }

            // ✅ Store user details (including token) in context
            setUser({ username: data.username, email: data.email, roles: data.roles, token: data.token });

            console.log("User logged in successfully:", data);

            // ✅ Navigate to home page
            navigate("/home");
        } catch (err) {
            setError(err.message);
            console.error("Login Error:", err);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f4f6f8" }}>
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

                <TextField label="Username" name="username" variant="outlined" fullWidth sx={{ mb: 2 }} value={credentials.username} onChange={handleChange} />
                <TextField label="Password" name="password" type="password" variant="outlined" fullWidth sx={{ mb: 3 }} value={credentials.password} onChange={handleChange} />

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                <Button variant="contained" fullWidth sx={{ py: 1.2 }} onClick={handleLogin}>
                    Login
                </Button>
            </Paper>
        </Box>
    );
}
