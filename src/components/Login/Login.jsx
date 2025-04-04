//import files for neccessary libraries
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth, db } from "../../firebase";  
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from './Login.module.css'
import { width } from "@mui/system";

//Login Function
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); 

  const login = async () => {
    try {
      //user credentials
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("Logged in successfully, committee:", userData.committee);
        navigate("/home"); 
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          setErrorMessage("Invalid password. Please try again.");
          setPassword("");
          break;
        case "auth/user-not-found":
          setErrorMessage("User not found. Please check your email.");
          setEmail("");
          break;
        default:
          setErrorMessage("Login failed. Please try again later.");
          break;
      }
    }
  };

  //HTML/XML Code Output
  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ marginLeft: "500px" }}>
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary w-100" onClick={login}>
          Login
        </button>
        {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;






