import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/config"; 

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false); 
  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User Signed Up:", userCredential.user);
      } else {
       
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User Logged In:", userCredential.user);
      }
      navigate("/"); 
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    }
  };

  return (
    <form className="Loginform-container" onSubmit={handleSubmit}>
      <div className="Login-container">
        <p style={{ color: "white" }} className="mb-5">{isSignUp ? "Sign Up" : "Login"}</p>
        <label htmlFor="Email" style={{ color: "white" }}>Email*</label>
        <input
          type="email"
          value={email}
          className="Login-input"
          name="Email"
          placeholder="Email"
          onChange={handleEmail}
          required
        />

        <label htmlFor="password" className="mt-4" style={{ color: "white" }}>Password*</label>
        <input
          type="password"
          value={password}
          name="password"
          className="Login-input"
          placeholder="Password"
          onChange={handlePassword}
          required
        />

        <button className="btn btn-dark btn-sm" type="submit">
          {isSignUp ? "Sign Up" : "Login"}
        </button>

        <p 
          style={{ color: "white", cursor: "pointer", marginTop: "10px" }}
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </div>

      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default Login;