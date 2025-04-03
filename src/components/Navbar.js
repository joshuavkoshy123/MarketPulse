import './navbar.css';
import { signOut } from "firebase/auth";
import { auth } from "../config/config";
import { useNavigate } from "react-router-dom";
function Navbar() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User Logged Out");
      navigate("/Login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };
  return (
    <nav className="navbar">
        <div className="navbar-logo">
            <a href="/">MarketPulse</a>
        </div>
        <div className="navbar-menu">
        <button className="btn btn-light" onClick={handleLogout}>Logout</button>
            <a href="/">Home</a> |  
            <a href="/stocks">Stocks</a>
            <a href ="/login">Login</a>
        </div>
    </nav>
  );
}

export default Navbar;