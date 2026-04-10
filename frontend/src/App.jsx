import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

function App() {
  return (

//     console.log({
//   Login,
//   Register,
//   Dashboard,
//   CreateJob,
//   PrivateRoute,
//   Navbar
    
// })
  
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-job"
          element={
            <PrivateRoute>
              <CreateJob />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );

}
export default App;