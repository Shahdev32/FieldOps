import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
//import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import ClientDashboard from "./pages/ClientDashboard";

import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>
        {/* ✅ DEFAULT ROUTE */}
        <Route path="/" element={<Login />} />

        {/* optional (you can remove register completely if you want) */}
        {/* <Route path="/register" element={<Register />} /> */}

        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/tech"
          element={
            <PrivateRoute role="technician">
              <TechnicianDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/client"
          element={
            <PrivateRoute role="client">
              <ClientDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}