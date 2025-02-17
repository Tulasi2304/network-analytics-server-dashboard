import React from 'react'
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';

export default function Home() {
    return (
        <Box sx={{ display: "flex" }}>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Typography sx={{ marginBottom: 2, marginTop: 10 }}>
                    <h1>Home</h1>
                </Typography>
            </Box>
        </Box>
    )
}
