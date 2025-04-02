import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaCommentDots, FaBell, FaCog, FaUserCircle, FaUserPlus } from "react-icons/fa";
import "./Navbar.css";
import useAuthStore from "../../../utils/authStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const userDropdownRef = useRef(null);
  const settingsDropdownRef = useRef(null);
  
  const { isAuthenticated, logout } = useAuthStore();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        <div className="logo">AAI Fin</div>

        {/* Hamburger Icon */}
        <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navigation Links */}
        <ul className={`nav-links ${isOpen ? "nav-active" : ""}`}>
          {isAuthenticated ? (
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
                <Link to="/mortgage" onClick={() => setIsOpen(false)}>&#x1F3E0; Mortgage</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
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
      {isAuthenticated && (
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
          
          {/* Settings Dropdown */}
          <div className="settings-icon-container" ref={settingsDropdownRef}>
            <FaCog 
              className="nav-icon" 
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)} 
            />
            {showSettingsDropdown && (
              <div className="dropdown-menu">
                <Link to="/add-bank-account" onClick={() => setShowSettingsDropdown(false)}>
                  <FaUserPlus style={{marginRight: "8px"}} />
                  Add Account
                </Link>
              </div>
            )}
          </div>
          
          {/* User Dropdown */}
          <div className="user-icon-container" ref={userDropdownRef}>
            <FaUserCircle 
              className="nav-icon" 
              onClick={() => setShowUserDropdown(!showUserDropdown)} 
            />
            {showUserDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setShowUserDropdown(false)}>Profile</Link>
                <button onClick={() => {
                  setShowUserDropdown(false);
                  logout();
                }}>Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;