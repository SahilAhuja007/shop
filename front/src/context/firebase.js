import { createContext, useContext, useEffect, useState } from "react";
import app from "../config/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";

if (app) {
  console.log("Firebase connected successfully!");
}

const FirebaseContext = createContext(null);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const FirebaseProvider = ({ children }) => {
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

  return (
    <FirebaseContext.Provider value={{ signinwithgoogle, user }}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
