import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Analysis from './Pages/Analysis';
import Inventory from './Pages/Inventory';
import TrendsAndAlerts from './Pages/TrendsAndAlerts'
import Sidebar from "./components/Sidebar";
import Box from "@mui/material/Box";

function App() {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Router>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/trends-and-alerts" element={<TrendsAndAlerts />} />
          </Routes>
        </Router>
      </Box>
    </>
  );
}

export default App;
