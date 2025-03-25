import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="home-content">
                <h1 className="home-title">Welcome to AAI Financials</h1>
                <p className="home-description">
                    We prioritize your financial journey with trust, transparency, and expertise.
                </p>
                <div className="home-buttons">
                    <button className="home-btn login-btn" onClick={() => navigate("/login")}>Login</button>
                    <button className="home-btn register-btn" onClick={() => navigate("/register")}>Register</button>
                </div>
            </div>
        </div>
    );
};

export default Home;
