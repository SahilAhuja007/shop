import { createContext, useContext, useEffect, useState } from "react";
import app from "../config/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

if (app) {
  console.log("Firebase connected successfully!");
}

const FirebaseContext = createContext(null);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const FirebaseProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      console.log("user:-", user);
    });
    return () => unsubscribe();
  }, []);

  const signinwithgoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
    } catch (e) {
      console.log("Issue while login with Google =>", e);
    }
  };
  const generateToken = async () => {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      console.log("token:-", token);
      return token;
    } else {
      alert("please login first");
      navigate("/userlogin");
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      console.log("User successfully signed out");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{ signinwithgoogle, user, generateToken, logout }}
    >
      {!loading && children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
