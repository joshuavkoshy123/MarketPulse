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
      <div className="navbar-container">
        <div className="navbar-logo">
          <a href="/">Market Pulse</a>
        </div>
        
        <div className="navbar-right">
          <div className="navbar-search">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          
          <div className="navbar-menu">
            <a href="/">Home</a>
            <span className="nav-divider">|</span>
            <a href="/stocks">Stocks</a>
            <span className="nav-divider">|</span>
            <a href="/profile">Profile</a>
            <span className="nav-divider">|</span>
            <a href="/login">Login</a>
            <span className="nav-divider">|</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;