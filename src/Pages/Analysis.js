import React, { useEffect, useState } from "react";
// import Box from "@mui/material/Box";
// import Typography from '@mui/material/Typography';
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import Grid from '@mui/material/Grid2'
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import { Chart } from "react-google-charts";

// import data from "../data/dummyData.json"; 


export default function Analysis() {
    <div></div>
}
//     const [selectedDeviceType, setSelectedDeviceType] = useState("");

// //     const [data, setData] = useState(null)
// // useEffect(() => {
// //     fetch("http://172.22.1.207:8081/devices")
// //       .then((res) => res.json())
// //       .then((data) => setData(data))
// //       .catch((err) => console.log(err));
// //   }, []);
//     const handleChange = (event) => {
//         setSelectedDeviceType(event.target.value);
//     };

//     const deviceTypes = [];
//     data.devices.forEach(device => {
//         if (!deviceTypes.includes(device.deviceType)) {
//             deviceTypes.push(device.deviceType);
//         }
//     });

//     const selectedDevices = data.devices.filter((device) => device.deviceType === selectedDeviceType);

//     const deviceIds = selectedDevices.map(device => device.id);
//     const metricsInfo = data.metrics.filter((metric) => deviceIds.includes(metric.deviceId))

//     const metricTypes = [...new Set(metricsInfo.map((metric) => metric.metricType))];

//     const timestamps = [...new Set(metricsInfo.map(metric => metric.timestamp))];

//     const getChartData = metricTypes.map((metricType) => {
//         const chartData = [
//             ["Device", ...timestamps] // Headers (Device Name, Timestamp1, Timestamp2)
//         ];

//         selectedDevices.forEach(device => {
//             const deviceMetrics = metricsInfo.filter(metric => metric.deviceId === device.id && metric.metricType === metricType);
//             const values = timestamps.map(timestamp => {
//                 const metric = deviceMetrics.find(m => m.timestamp === timestamp);
//                 return metric ? metric.value : 0; // Replace null with 0 to avoid Google Charts error
//             });

//             chartData.push([device.deviceName, ...values]);
//         });

//         return chartData;
//     });
//     console.log(getChartData)

//     return (
//         <Box sx={{ marginTop: 8 }}>
//             <Grid container spacing={2}>

//                 <Grid>
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2, m: 5 }}>
//                         <Card sx={{ px: 5, py: 2 }}>
//                             <CardContent>
//                                 <Typography gutterBottom variant="body1" component="div" sx={{ my: 2 }}>Select a Device Type:</Typography>
//                                 <Typography variant="body2" component="div" sx={{ color: 'text.secondary' }}>
//                                     <FormControl sx={{ minWidth: 200 }}>
//                                         <InputLabel>Device Type</InputLabel>
//                                         <Select value={selectedDeviceType} onChange={handleChange} label="Device Type">
//                                             <MenuItem value="">-- Select a Device Type --</MenuItem>
//                                             {deviceTypes.map((type) => (
//                                                 <MenuItem key={type} value={type}>
//                                                     {type}
//                                                 </MenuItem>
//                                             ))}
//                                         </Select>
//                                     </FormControl>
//                                 </Typography>
//                             </CardContent>
//                         </Card>
//                     </Box>
//                 </Grid>
//             </Grid>

//             <Grid container spacing={2} direction="row" sx={{justifyContent: "flex-start",alignItems: "center"}}>
//                 {selectedDeviceType && metricTypes.map(metricType => (
//                     <Grid size={6} sx={{display: "flex"}}>
//                         <Box key={metricType} sx={{flex: 1, border: "1px solid #ddd", p: 2, m:4, borderRadius: 2, boxShadow: 1, display: "flex" }}>
//                             <Typography variant="h6">{metricType} Over Devices</Typography>
//                             <Chart
//                                 chartType="LineChart"
//                                 width="500px"
//                                 height="400px"
//                                 data={getChartData[metricTypes.indexOf(metricType)]}
//                                 options={{
//                                     hAxis: { title: "Devices" },
//                                     vAxis: { title: metricType },
//                                     // curveType: "function",
//                                     legend: { position: "bottom" },
//                                 }}
//                             />
//                         </Box>
//                      </Grid>
//                 ))}
//             </Grid>
//         </Box>
//     )
// }

