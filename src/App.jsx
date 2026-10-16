
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

import Home from "./Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard.jsx";
import { auth } from "./firebase/firebase";
import ChangeLocation from "./pages/ChangeLocation";
import Inventory from "./pages/Inventory";
import Expiry from "./pages/Expiry";
import StockExchange from "./pages/StockExchange";
import Orders from "./pages/Orders";
import SalesAnalysis from "./pages/SalesAnalysis";
import AiSuggestions from "./pages/AiSuggestions";
import Profile from "./pages/Profile";
import Customer from "./pages/Customer";
import Suppliers from "./pages/Suppliers";
import Settings from "./pages/Settings";

function ProtectedDashboard() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  if (user === undefined) {
    return <p>Loading Zosto...</p>;
  }

  return user ? <Dashboard /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/settings" element={<Settings />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/customers" element={<Customer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-suggestions" element={<AiSuggestions />} />
        <Route path="/sales-analysis" element={<SalesAnalysis />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/stock-exchange" element={<StockExchange />} />
        <Route
          path="/change-location"
          element={<ChangeLocation />}
        />
        <Route path="/expiry" element={<Expiry />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
