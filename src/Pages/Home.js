import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Home() {
  // useEffect(() => {
  //   fetch("http://172.22.1.207:8081/devices")
  //     .then((res) => res.json())
  //     .then((data) => console.log(data))
  //     .catch((err) => console.log(err));
  // }, []);
  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography sx={{ marginBottom: 2, marginTop: 10 }}>
          <h1>Home</h1>
        </Typography>
      </Box>
    </Box>
  );
}
