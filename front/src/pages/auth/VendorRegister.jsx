import React from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../context/firebase";
import axios from "axios";

const VendorRegister = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await firebase.signinwithgoogle();

      const token = await firebase.generateToken();
      console.log("token : ", token);

      const response = await axios.get(
        "http://localhost:3000/riwaz/vendor/isFirstLogin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.isFirstLogin) {
        navigate("/ApplicationForm", { state: { role: "vendor" } });
      } else {
        navigate("/vendorDashboard");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert(error.response.data.message || "Access denied.");
        navigate("/");
      } else {
        console.log("Issue while vendor login =>", error);
      }
    }
  };

  return (
    <div style={{ justifyContent: "center", display: "flex" }}>
      <button onClick={handleLogin}>Sign In With Google</button>
    </div>
  );
};

export default VendorRegister;
