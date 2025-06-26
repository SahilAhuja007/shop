import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useFirebase } from "../context/firebase";

const UserRegister = () => {
  const navigate = useNavigate();
  const firebase = useFirebase();

  useEffect(() => {
    if (firebase.user) {
      navigate("/userDashboard");
    }
  }, [firebase.user, navigate]);

  const handleLogin = async () => {
    try {
      await firebase.signinwithgoogle();

      const token = await firebase.generateToken();
      console.log("token:", token);

      const response = await axios.get(
        "http://localhost:3000/riwaz/user/isFirstLogin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isFirstLogin) {
        navigate("/ApplicationForm", { state: { role: "user" } });
      } else {
        navigate("/userDashboard");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert(error.response.data.message || "Access denied.");
        navigate("/");
      } else {
        console.error("Login error:", error);
        alert("Something went wrong during login.");
      }
    }
  };

  return (
    <div style={{ justifyContent: "center", display: "flex" }}>
      <h1>User Login</h1>
      <button onClick={handleLogin}>Sign In With Google</button>
    </div>
  );
};

export default UserRegister;
