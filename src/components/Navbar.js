import { Link } from "react-router-dom";
import './navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
        <div className="navbar-logo">
            <a href="/">MarketPulse</a>
        </div>
        <div className="navbar-menu">
            <a href="/">Home</a> |  
            <a href="/stocks">Stocks</a>
        </div>
    </nav>
  );
}

export default Navbar;