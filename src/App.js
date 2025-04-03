import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
//import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";  // Optional: Add a navigation bar
import Login from "./components/Login";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;