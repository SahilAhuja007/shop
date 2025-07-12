import "./App.css";
import { Routes, Route } from "react-router-dom";
import UserRegister from "./pages/auth/UserRegister";
import VendorRegister from "./pages/auth/VendorRegister";
import AdminRegister from "./pages/auth/AdminRegister";
import Application_From from "./pages/auth/Application_From";
import Home from "./pages/user/home";
function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/userLogin" element={<UserRegister />} />
      <Route path="/vendorLogin" element={<VendorRegister />} />
      <Route path="/adminLogin" element={<AdminRegister />} />
      <Route path="/ApplicationForm" element={<Application_From />} />
    </Routes>
  );
}

export default App;
