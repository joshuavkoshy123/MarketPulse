import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/config"; 
import "./Login.css";

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
    <div className="login-page">
      <div className="header">
      </div>
      
      <div className="login-container">
        <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              className="form-input"
              placeholder="username"
              onChange={handleEmail}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              className="form-input"
              placeholder="password"
              onChange={handlePassword}
              required
            />
            <div className="forgot-password">
              <span>forgot password?</span>
            </div>
          </div>

          <button type="submit" className="sign-in-button">
            Sign in
          </button>
        </form>

        <p className="toggle-signup" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
        
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <div className="back-arrow">
        <span>←</span>
      </div>
    </div>
  );
}

export default Login;