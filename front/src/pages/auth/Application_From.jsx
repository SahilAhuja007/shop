import React, { useState } from "react";
import axios from "axios";
import { useFirebase } from "../../context/firebase";
import { useNavigate, useLocation } from "react-router-dom";

const Application_From = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firebase = useFirebase();

  const [phone_number, setPhone_number] = useState("");
  const role = location.state?.role || "";

  const handleSubmit = async () => {
    try {
      const token = await firebase.generateToken();
      const result = await axios.post(
        `http://localhost:3000/riwaz/${role}/applicationFrom`,
        { phone_number, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (result.data.success === true) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <h1>Application Form</h1>
      <label htmlFor="phone_number">Phone Number</label>
      <input
        type="text"
        placeholder="8475963251"
        id="phone_number"
        value={phone_number}
        onChange={(e) => setPhone_number(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Application_From;
