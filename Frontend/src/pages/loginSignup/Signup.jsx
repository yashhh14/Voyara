import axios from "axios";
import React, { useEffect, useState } from "react";
import "./signup.css";
import Success from "../../components/Success";
import { NavLink } from "react-router-dom";
import useApi from "../../customeHooks/useApi";
import Loader from "../../components/Loader/Loader";


const Signup = () => {
    const [loading, setLoading] = useState(true);
    let { apiData, Api } = useApi()
    let [err, setErr] = useState('')
    let [passwordErr, setPasswordErr] = useState('')
    let [emailErr, setEmailErr] = useState('')
    let [err1, setErr1] = useState('')
    const [details, setDetails] = useState({
        email: "",
        userName: "",
        password: "",
    });
    let [visible, setVisible] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const valid = /^[a-zA-Z0-9_.]+$/;
    const mailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|ai)$/
    const passwordValid = /^\S{8,}$/;
    setTimeout(()=>{
        setLoading(false)
    },1000)
    function handleInputs(e) {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
        if (name === "email") {
            if (value.length === 0) {
                setEmailErr("");
                return;
            }
            if (!mailValid.test(value)) {
                setEmailErr("Please enter a valid email address.");
            } else {
                setEmailErr("");
            }
        }
        if (name === "userName") {
            if (value.length === 0) {
                setErr("");
                setErr1("");
                return;
            }
            if (value.includes(" ")) {
                setErr1("Spaces are not allowed");
                setErr("");
                return;
            }
            if (!valid.test(value)) {
                setErr1("Only letters, numbers, dots (.) and underscores (_) are allowed.");
                setErr("");
                return;
            }
            setErr1("");
            if (value.length <= 4) {
                setErr("");
            }
        }
        if (name === "password") {
            if (value.length === 0) {
                setPasswordErr("");
                return;
            }
            if (!passwordValid.test(value)) {
                setPasswordErr("Password must be at least 8 characters and must not contain spaces.");
            } else {
                setPasswordErr("");
            }
        }
    }
    async function showData() {
        if (err1) return;
        if (err === "User Name Already Exists") return;
        if (passwordErr) return;
        try {
            const signUpRes = await Api("http://localhost:8080/signup", "post", details);
            setVisible(true)
        } catch (err) {
            setVisible(false)
        }
    }
    useEffect(() => {
        if (details.userName.length <= 4) return;
        if (err1) return;
        const timer = setTimeout(async () => {
            try {
                const res = await Api(`http://localhost:8080/userName/${details.userName}`, "get");
                setErr(res.message);
            } catch (err) {
                console.log(err);
            }
        }, 1200);
        return () => clearTimeout(timer);
    }, [details.userName, err1]);
    if (loading) {
        return <Loader />
    }
    return (
        <>
            {visible && <Success message="Successfully Created Account" link='/login' />}
            <div className="voyara-login-container">
                <div className="voyara-login-card">
                    <div className="voyara-brand">
                        <span className="voyara-logo">
                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                                <rect x="3" y="3" width="28" height="28" rx="8" transform="rotate(45 17 17)" stroke="url(#grad2)" strokeWidth="2.5" />
                                <circle cx="17" cy="17" r="5" fill="url(#grad2)" />
                                <defs>
                                    <linearGradient id="grad2" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#4F46E5" />
                                        <stop offset="1" stopColor="#9333EA" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                        <span className="voyara-name">Voyara</span>
                    </div>

                    <h2 className="voyara-title">Create Account</h2>
                    <p className="voyara-subtitle">Join Voyara and share your journeys</p>
                    <div className="voyara-input-group">
                        <span className="voyara-input-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="5" width="18" height="14" rx="2" />
                                <path d="M3 7l9 6 9-6" />
                            </svg>
                        </span>
                        <input
                            type="email"
                            className="voyara-input"
                            placeholder="Email"
                            name="email"
                            value={details.email}
                            onChange={handleInputs}
                        />
                    </div>
                    {emailErr && (
                        <small className="voyara-error">
                            {emailErr}
                        </small>
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
                            placeholder="Username"
                            name="userName"
                            value={details.userName}
                            onChange={handleInputs}
                        />
                    </div>
                    {err && (
                        <small className={err === "Username is available" ? "voyara-success" : "voyara-error"}>
                            {err}
                        </small>
                    )}
                    {err1 && (
                        <small className="voyara-error">
                            {err1}
                        </small>
                    )}


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
                    {passwordErr && (
                        <small className="voyara-error">
                            {passwordErr}
                        </small>
                    )}

                    <button className="voyara-login-btn voyara-signup-btn" onClick={showData} disabled={err1 || err === "User Name Already Exists"} >
                        Sign Up
                    </button>
                    <p className="voyara-signup-text">
                        Already have an account?{" "}
                        <NavLink to="/login" className="voyara-signup-link">
                            Login
                        </NavLink>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Signup;
