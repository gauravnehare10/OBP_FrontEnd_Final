import React, { useState } from "react";
import axios from 'axios';
import "./Register.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../utils/authStore";

const Register = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactnumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

    const handleRegister = (e) => {
        e.preventDefault();
        if (username === '' || password === '') {
        setError('Please fill in both fields');
        return;
        }

        setError('');
        setSuccess('');
        const endpoint = "http://127.0.0.1:8000/register"
        axios.post(endpoint, {
            username: username.toLowerCase(),
            name: name,
            email: email,
            contactnumber: contactnumber,
            password: password,
        },)
        .then((response) => {
            console.log('Register successful:', response.data);
            const { access_token, refresh_token, expires_in, token_type } = response.data;
            setSuccess('Logged in Successfully.');
            setAuthenticated(access_token, refresh_token, token_type, expires_in);
            navigate('/')
        })
        .catch((error) => {
            console.log('Register Error', error);
            setError('Invalid username or password. Please try again.');
        })
    }

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-left">
          <h1 className="brand-title">AAI Financials</h1>
          <p className="tagline">
            Where we prioritize your financial journey with trust, transparency, and expertise
          </p>
          <div className="image-placeholder"></div>
        </div>
        <div className="register-right">
          <h2 className="welcome-text">Welcome</h2>
          <p className="register-subtext">Register here</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          <form className="register-form" onSubmit={ handleRegister }>
            <div className="input-group">
              <input type="text" placeholder="Username" value={username} onChange={ (e) => setUsername(e.target.value)}  required />
            </div>
            <div className="input-group">
              <input type="text" placeholder="Full Name" value={name} onChange={ (e) => setName(e.target.value)}  required />
            </div>
            <div className="input-group">
              <input type="email" placeholder="Email" value={email} onChange={ (e) => setEmail(e.target.value)}  required />
            </div>
            <div className="input-group">
              <input type="number" placeholder="Contact Number" value={contactnumber} onChange={ (e) => setContactNumber(e.target.value)}  required />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" value={password} onChange={ (e) => setPassword(e.target.value)} required />
            </div>
            <p className="forgot-password">Forgot your password?</p>
            <button type="submit" className="register-btn">Register</button>
          </form>
          <p className="register-text">
            Already have an account? <span className="login-link" onClick={()=> navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
