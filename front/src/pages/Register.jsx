import React from "react";

import { useFirebase } from "../context/firebase";
const Register = () => {
  const firebase = useFirebase();
  return (
    <div style={{ justifyContent: "center", display: "flex" }}>
      <button onClick={firebase.signinwithgoogle}>SignIn With Google</button>
    </div>
  );
};

export default Register;
