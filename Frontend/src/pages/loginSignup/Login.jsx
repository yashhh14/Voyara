import axios from "axios";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./login.css";
import useApi from "../../customeHooks/useApi";
import Loader from "../../components/Loader/Loader";

const Login = () => {
    const [loading, setLoading] = useState(true);
    const { apiData, Api } = useApi();
    const navigate = useNavigate();
    const [loginErr, setLoginErr] = useState("");
    setTimeout(() => {
        setLoading(false)
    }, 1000);
    const [details, setDetails] = useState({
        user_email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    function handleInputs(e) {
        setDetails({
            ...details, [e.target.name]: e.target.value,
        });
    }

    async function handleLogin() {
        try {
            const data = await Api("http://localhost:8080/login", "post", details);
            if (data.message !== "Login Success") {
                data.message!=="incorrect password"?alert("username or email not exists"):"incorrect password"
                return 
            }
            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    }
    if (loading) {
        return <Loader />
    }
    return (
        <div className="voyara-login-container">
            <div className="voyara-login-card">
                <div className="voyara-brand">
                    <span className="voyara-logo">
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                            <rect x="3" y="3" width="28" height="28" rx="8" transform="rotate(45 17 17)" stroke="url(#grad)" strokeWidth="2.5" />
                            <circle cx="17" cy="17" r="5" fill="url(#grad)" />
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#4F46E5" />
                                    <stop offset="1" stopColor="#9333EA" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                    <span className="voyara-name">Voyara</span>
                </div>

                <h2 className="voyara-title">Welcome Back</h2>
                <p className="voyara-subtitle">Login to continue your journey</p>
                {loginErr && (
                    <p className="voyara-error">
                        {loginErr}
                    </p>
                )}
                <div className="voyara-input-group">
                    <span className="voyara-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        className="voyara-input"
                        placeholder="Email / Username"
                        name="user_email"
                        value={details.user_email}
                        onChange={handleInputs}
                    />
                </div>

                <div className="voyara-input-group">
                    <span className="voyara-input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="4" y="10" width="16" height="10" rx="2" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                        </svg>
                    </span>
                    <input
                        type={showPassword ? "text" : "password"}
                        className="voyara-input"
                        placeholder="Password"
                        name="password"
                        value={details.password}
                        onChange={handleInputs}
                    />
                    <span
                        className="voyara-eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 3l18 18" />
                                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                <path d="M9.9 5.5A10.4 10.4 0 0 1 12 5c5 0 9 4 10 7-.4 1.2-1.2 2.5-2.3 3.6M6.4 6.4C4.4 7.7 2.9 9.6 2 12c1 3 5 7 10 7 1.2 0 2.3-.2 3.4-.6" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </span>
                </div>

                <div className="voyara-row">

                    <NavLink to="/forgot-password" className="voyara-forgot">
                        Forgot Password?
                    </NavLink>
                </div>

                <button className="voyara-login-btn" onClick={handleLogin}>
                    Login
                </button>

                <div className="voyara-divider">
                    <span>OR</span>
                </div>

                <button className="voyara-google-btn">
                    <svg width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
                        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.3 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6 29.4 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z" />
                        <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.2C29.4 35 26.8 36 24 36c-5.2 0-9.6-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.8l6.3 5.2C40.8 36.1 44 30.6 44 24c0-1.2-.1-2.4-.4-3.5z" />
                    </svg>
                    Continue with Google
                </button>

                <p className="voyara-signup-text">
                    Don't have an account?{" "}
                    <NavLink to="/signup" className="voyara-signup-link">
                        Sign Up
                    </NavLink>
                </p>
            </div>
        </div>
    );
};

export default Login;
