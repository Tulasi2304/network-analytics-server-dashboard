import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid, Button, CircularProgress } from "@mui/material";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import DevicesIcon from "@mui/icons-material/Devices";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import BarChartIcon from "@mui/icons-material/BarChart";
// import LiveHelpIcon from "@mui/icons-material/LiveHelp";

export default function Home() {

  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    alerts: 0,
    analysisResults: 0
  });

  useEffect(() => {
    // Fetch devices
    fetch("http://localhost:8081/devices")
      .then((res) => res.json())
      .then((devices) => {
        const totalDevices = devices.length;
        const activeDevices = devices.filter((device) => device.status === "Active").length;
        setStats((prev) => ({ ...prev, totalDevices, activeDevices }));
      })
      .catch((err) => console.error("Error fetching devices:", err));

    // Fetch alerts
    fetch("http://localhost:8081/alerts")
      .then((res) => res.json())
      .then((alerts) => {
        setStats((prev) => ({ ...prev, alerts: alerts.length }));
      })
      .catch((err) => console.error("Error fetching alerts:", err));
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3, marginTop: 13 }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 300, // Adjust height as needed
          backgroundImage: "url('https://andersontech.com/wp-content/uploads/2017/12/Wired-vs-Wireless-Networks.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box sx={{ bgcolor: "rgba(0, 0, 0, 0.6)", p: 3, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Unlock Insights, Elevate Performance
          </Typography>
          <Typography variant="subtitle1" sx={{ fontStyle: "italic" }}>
            A dashboard with real-time device inventory, to analyze device metrics and get alerts.
          </Typography>
        </Box>
      </Box>

      {/* Quick Stats Section */}
      <Grid container spacing={3} my={2}>
        {/* Total Devices */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <DevicesIcon color="primary" fontSize="large" />
              <Typography variant="h5">{stats.totalDevices}</Typography>
              <Typography variant="body2">Total Devices</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Devices */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <NetworkCheckIcon color="success" fontSize="large" />
              <Typography variant="h5">{stats.activeDevices}</Typography>
              <Typography variant="body2">Active Devices</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <NotificationsActiveIcon color="error" fontSize="large" />
              <Typography variant="h5">{stats.alerts}</Typography>
              <Typography variant="body2">Critical Alerts</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/*Analysis reports*/}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <BarChartIcon color="primary" fontSize="large" />
              <Typography variant="h5">{stats.analysisResults}</Typography>
              <Typography variant="body2">New Analysis Reports</Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>


      {/* Quick Navigation Buttons */}
      {/* <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Explore Key Features
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button variant="contained" color="primary" component={Link} to="/analysis">
              <BarChartIcon sx={{ mr: 1 }} /> View Analysis
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" component={Link} to="/inventory">
              <DevicesIcon sx={{ mr: 1 }} /> Device Inventory
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="error" component={Link} to="/trends-and-alerts">
              <NotificationsActiveIcon sx={{ mr: 1 }} /> View Alerts
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="info" component={Link} to="/metrics">
              <LiveHelpIcon sx={{ mr: 1 }} /> Network Metrics
            </Button>
          </Grid>
        </Grid>
      </Box> */}
    </Box>
  );
}
