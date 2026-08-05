import {
  FaUser,
  FaLock,
  FaGlobe,
  FaDatabase,
  FaInfoCircle,
  FaSignOutAlt,
  FaTrash,
  FaTimes
} from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../customeHooks/useContext";
import { useNavigate } from "react-router-dom";
import "./settings.css";
import useApi from "../../customeHooks/useApi";
import { useState } from "react";
import { useEffect } from "react";

function Settings() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const { apiData, Api } = useApi()
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  }
  async function getProfile() {
    const res = await Api("http://localhost:8080/profile", "get",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setUser(res);
  }
  console.log(user);
  function handleClose() {
    navigate("/profile");
  }
  function navToEdit() {
    navigate('/profile/editProfile')
  }
  async function handlePrivacyChange(e) {
    const value = e.target.checked
    setUser({ ...user, isPublic: value });
    try {
      await Api( "http://localhost:8080/updatePrivacy", "put",
        { isPublic: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.log(err);
      setUser({ ...user, isPublic: !value });
    }
  }
  useEffect(() => {
    getProfile()
  }, [])
  return (
    <div className="settings-container">
      <div className="settings-card">

        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
        <div className="settings-section">
          <h4>Account</h4>
          <div className="settings-item" onClick={navToEdit}>
            <FaUser />
            <span>Edit Profile</span>
          </div>
          <div className="settings-item">
            <FaLock />
            <span>Change Password</span>
          </div>
        </div>
        <div className="settings-section">
          <h4>Privacy</h4>
          <div className="settings-item space-between">
            <span >Public Account</span>
            <input type="checkbox" checked={user.isPublic} onChange={handlePrivacyChange} />
          </div>
        </div>
        <div className="settings-section">
          <h4>Preferences</h4>
          <div className="settings-item">
            <FaGlobe />
            <span>Language</span>
          </div>
          <div className="settings-item">
            <FaGlobe />
            <span>Theme</span>
          </div>
        </div>
        <div className="settings-section">
          <h4>Data</h4>
          <div className="settings-item">
            <FaDatabase />
            <span>Download My Data</span>
          </div>
          <div className="settings-item">
            <FaDatabase />
            <span>Clear Search History</span>
          </div>
        </div>
        <div className="settings-section">
          <h4>About</h4>
          <div className="settings-item">
            <FaInfoCircle />
            <span>Help Center</span>
          </div>
          <div className="settings-item">
            <FaInfoCircle />
            <span>Privacy Policy</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
        <button className="delete-btn">
          <FaTrash />
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default Settings;