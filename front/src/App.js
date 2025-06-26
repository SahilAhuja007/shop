import "./App.css";
import { Routes, Route } from "react-router-dom";
import UserRegister from "./pages/UserRegister";
import VendorRegister from "./pages/VendorRegister";
import AdminRegister from "./pages/AdminRegister";
import Application_From from "./pages/Application_From";
function App() {
  return (
    <Routes>
      <Route path="/userLogin" element={<UserRegister />} />
      <Route path="/vendorLogin" element={<VendorRegister />} />
      <Route path="/adminLogin" element={<AdminRegister />} />
      <Route path="/ApplicationForm" element={<Application_From />} />
    </Routes>
  );
}

export default App;
