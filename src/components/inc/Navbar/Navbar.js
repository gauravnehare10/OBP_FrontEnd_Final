import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import useAuthStore from "../../../utils/authStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { isAuthenticated, logout} = useAuthStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.body.style.paddingTop = isAuthenticated ? "120px" : "60px";

    return () => {
      document.body.style.paddingTop = "60px";
    };
  }, [isAuthenticated]);

  return (
    <div>
      {/* Main Navbar */}
      <nav className="navbar">
        <div className="logo">AAI Financials</div>

        {/* Hamburger Icon */}
        <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${isOpen ? "nav-active" : ""}`}>
        { isAuthenticated? (
          <>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>Dashboard</Link>
          </li>
          <li>
            <Link to="/payments" onClick={() => setIsOpen(false)}>&#163; Payment</Link>
          </li>
          <li>
            <Link to="/transactions" onClick={() => setIsOpen(false)}>&#8644; Transactions</Link>
          </li>
          <li>
            <Link onClick={()=>logout()}>Logout</Link>
          </li>
          </>
        ):(
          <>
          <li>
            <Link to="/" onClick={()=> setIsOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
          </li>
          <li>
            <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
          </li>
          </>
        )}
        </ul>
      </nav>

      {/* Small Navbar */}
      {isAuthenticated?(
        <div className="small-navbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </div>
        <FaCommentDots className="nav-icon" />
        <FaBell className="nav-icon" />
        <FaCog className="nav-icon" />
        <FaUserCircle className="nav-icon" />
      </div>
      ):(
        <>
        </>
      )}
    </div>
  );
};

export default Navbar;
