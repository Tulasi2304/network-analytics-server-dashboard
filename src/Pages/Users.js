import React, { useState, useEffect } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Menu, MenuItem, Tooltip } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../context/UserContext";

export default function UsersTable() {
    const [users, setUsers] = useState([]);
    // const users = data.users;
    const [selectedRole, setSelectedRole] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const { user } = useAuth();
    const token = user.token;

    useEffect(() => {
        fetch("http://localhost:8081/admin/allusers", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Include token if authentication is required
                "Content-Type": "application/json"
            }
        })
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.log(err));
    }, []);
    
    console.log(users);

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (role) => {
        setSelectedRole(role);
        setAnchorEl(null);
    };

    const roles = [...new Set(users.flatMap(user => user.roles.map(role => role.name)))];
    const filteredUsers = users.filter(user => 
        selectedRole === "" || user.roles.some(role => role.name === selectedRole)
    );
    

    return (
        <Box sx={{ marginTop: 8, padding: 4, mx: "auto", width: "80%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">Users</Typography>
                <Box>
                    <IconButton onClick={handleFilterClick} sx={{ mx: 2 }}>
                        <FilterListIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleFilterClose("")}> 
                        <MenuItem onClick={() => handleFilterClose("")}>All</MenuItem>
                        {roles.map((role) => (
                            <MenuItem key={role} onClick={() => handleFilterClose(role)}>{role}</MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                            <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                            {/* <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell> */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user, index) => (
                            <TableRow key={user.id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white" }}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.roles.map(role => role.name).join(", ")}</TableCell>
                                {/* <TableCell align="center">
                                    <Tooltip title="Edit">
                                        <IconButton>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
