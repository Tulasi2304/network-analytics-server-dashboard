import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Home from './Pages/Home';
import Analysis from './Pages/Analysis';
import Inventory from './Pages/Inventory';
import Trends from './Pages/Trends'
import Metrics from './Pages/Metrics';
import ChangePassword from './Pages/ChangePassword'
import Users from './Pages/Users';
import Alerts from './Pages/Alerts';
import { useAuth, UserProvider} from "./context/UserContext";
import Sidebar from "./components/Sidebar";
import Box from "@mui/material/Box";
import AddUser from './Pages/AddUser';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute />} />
          <Route path="/login" element={<Login />} />
          <Route path='/change-password' element={<ChangePassword />} />
          <Route path="/*" element={<LayoutWithSidebar />} />
          <Route path='/add-user' element={<AddUser />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <Navigate to="/home" /> : <Navigate to="/login" />;
}

function LayoutWithSidebar() {
  const { user } =useAuth();
  if (!user) return <Navigate to="/login" />;
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path='/metrics' element={<Metrics />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Box>
  );
}

export default App;
