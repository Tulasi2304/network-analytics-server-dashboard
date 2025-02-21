import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Home from './Pages/Home';
import Analysis from './Pages/Analysis';
import Inventory from './Pages/Inventory';
import TrendsAndAlerts from './Pages/TrendsAndAlerts'
import Metrics from './Pages/Metrics';
import ChangePassword from './Pages/ChangePassword'
import Sidebar from "./components/Sidebar";
import Box from "@mui/material/Box";
import AddUser from './Pages/AddUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path='/add-user' element={<AddUser />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path="/*" element={<LayoutWithSidebar />} />
      </Routes>
    </Router>
  );
}

function LayoutWithSidebar() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/trends-and-alerts" element={<TrendsAndAlerts />} />
        <Route path='/metrics' element={<Metrics />} />
      </Routes>
    </Box>
  );
}

export default App;
