import React, { useState } from "react";
import axios from 'axios';
import "./Login.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../utils/authStore";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === '' || password === '') {
        setError('Please fill in both fields');
        return;
        }

        setError('');
        setSuccess('');
        const endpoint = "http://127.0.0.1:8000/token"
        axios.post(endpoint, {
            username: username.toLowerCase(),
            password: password
        }, {
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
        },)
        .then((response) => {
            console.log('Login successful:', response.data);
            const { access_token, refresh_token, expires_in, token_type } = response.data;
            setSuccess('Logged in Successfully.');
            setAuthenticated(access_token, refresh_token, token_type, expires_in);
            navigate('/');
        })
        .catch((error) => {
            console.log('Login Error', error);
            setError('Invalid username or password. Please try again.');
        })
    }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-left">
          <h1 className="brand-title">AAI Financials</h1>
          <p className="tagline">
            Where we prioritize your financial journey with trust, transparency, and expertise
          </p>
          <div className="image-placeholder"></div>
        </div>
        <div className="login-right">
          <h2 className="welcome-text">Welcome</h2>
          <p className="login-subtext">Login with username</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <form className="login-form" onSubmit={ handleLogin }>
            <div className="input-group">
              <input type="text" placeholder="Username" value={username} onChange={ (e) => setUsername(e.target.value)}  required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" value={password} onChange={ (e) => setPassword(e.target.value)} required />
            </div>
            <p className="forgot-password">Forgot your password?</p>
            <button type="submit" className="login-btn">LOGIN</button>
          </form>
          <p className="register-text">
            Don't have an account? <span className="register-link" onClick={()=> navigate("/register")}>Register Now</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
