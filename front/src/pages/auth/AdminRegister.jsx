import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import axios from "axios";

const AdminRegister = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();
  const [role, setUserRole] = useState("");

  const getUserRole = async () => {
    try {
      const token = await firebase.generateToken();

      const response = await axios.get(
        "http://localhost:3000/riwaz/user/userRole",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const userRole = response.data.data;
        setUserRole(userRole);

        if (userRole === "admin") {
          navigate("/adminDashboard");
        } else if (userRole === "vendor") {
          navigate("/vendorDashboard");
        } else {
          navigate("/userDashboard");
        }
      }
    } catch (error) {
      console.error("Error while fetching user role:", error);
    }
  };

  const handleLogin = async () => {
    try {
      await firebase.signinwithgoogle();
      await getUserRole();
    } catch (error) {
      console.log("Error during admin login:", error);
    }
  };

  return (
    <div style={{ justifyContent: "center", display: "flex" }}>
      <h1>Admin Login</h1>
      <button onClick={handleLogin}>Sign In With Google</button>
    </div>
  );
};

export default AdminRegister;
