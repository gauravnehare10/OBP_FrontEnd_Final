import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AccountNav.css";

const AccountNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Function to close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button className="sidebar-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <div ref={sidebarRef} className={`account-nav ${isOpen ? "open" : ""}`}>
        <h2>Account Menu</h2>
        <ul>
          <li className={location.pathname.includes("/transactions") ? "active" : ""}>
            <Link to="/transactions">Transactions</Link>
          </li>
          <li className={location.pathname.includes("/beneficiaries") ? "active" : ""}>
            <Link to="/beneficiaries">Beneficiaries</Link>
          </li>
          <li className={location.pathname.includes("/standing-orders") ? "active" : ""}>
            <Link to="/standing-orders">Standing Orders</Link>
          </li>
          <li className={location.pathname.includes("/settings") ? "active" : ""}>
            <Link to="/direct-debits">Settings</Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default AccountNav;
