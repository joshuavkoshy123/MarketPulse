import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/config"; 

function SignUp({ toggle }) {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User Signed Up:", userCredential.user);

      // TODO: Optional - Store first/last name in Firestore

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className="Loginform-container" onSubmit={handleSubmit}>
      <div className="Login-container">
        <p style={{ color: "white" }} className="mb-5">Sign Up</p>

        <label style={{ color: "white" }}>First Name*</label>
        <input
          type="text"
          value={first_name}
          className="Login-input"
          placeholder="First Name"
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label style={{ color: "white" }}>Last Name*</label>
        <input
          type="text"
          value={last_name}
          className="Login-input"
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label style={{ color: "white" }}>Email*</label>
        <input
          type="email"
          value={email}
          className="Login-input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label style={{ color: "white" }}>Password*</label>
        <input
          type="password"
          value={password}
          className="Login-input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-dark btn-sm" type="submit">Sign Up</button>
        {error && <div className="error">{error}</div>}

        <p 
          style={{ color: "white", cursor: "pointer", marginTop: "10px" }}
          onClick={toggle}
        >
          Already have an account? Login
        </p>
      </div>
    </form>
  );
}

function Login({ toggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User Logged In:", userCredential.user);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className="Loginform-container" onSubmit={handleSubmit}>
      <div className="Login-container">
        <p style={{ color: "white" }} className="mb-5">Login</p>

        <label style={{ color: "white" }}>Email*</label>
        <input
          type="email"
          value={email}
          className="Login-input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label style={{ color: "white" }}>Password*</label>
        <input
          type="password"
          value={password}
          className="Login-input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-dark btn-sm" type="submit">Login</button>
        {error && <div className="error">{error}</div>}

        <p 
          style={{ color: "white", cursor: "pointer", marginTop: "10px" }}
          onClick={toggle}
        >
          Don't have an account? Sign Up
        </p>
      </div>
    </form>
  );
}

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div>
      {isSignUp ? (
        <SignUp toggle={() => setIsSignUp(false)} />
      ) : (
        <Login toggle={() => setIsSignUp(true)} />
      )}
    </div>
  );
}

export default AuthPage;
