import { useContext, useEffect, useState } from "react";
import useApi from "../../customeHooks/useApi";
import './profile.css'
import profile from '../../assets/profile.png'
import { NavLink } from "react-router-dom";
import { FaSlidersH } from "react-icons/fa";
import MyTrips from "../MyTrips/MyTrips";
import {
  FaLock
} from "react-icons/fa";

function Profile() {
  const token = localStorage.getItem("token");
  const { apiData, Api } = useApi()
  const [user, setUser] = useState([]);
  const [myTrips,setMyTrips]=useState([])
  async function getProfile() {
    const res = await Api("https://backend-r2uw.onrender.com/profile", "get",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setUser(res);
  }
  async function tripsData() {
    const res = await Api("https://backend-r2uw.onrender.com/myTrips", "get",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMyTrips(res);
  }
  useEffect(() => {
    tripsData();
    if (!token) {
      return navigate('/login')
    }
    getProfile()
  }, []);
  if (!user) return <h3>Loading...</h3>;
  return (
    <div className="profile-page">
      <div className="profile-header">
        <img src={user.profilePic ? `https://backend-r2uw.onrender.com/uploads/${user.profilePic}` : profile} className="profile-avatar" />
        <div className="profile-info">
          <div className="top-row">
            <div className="d-flex gap-2 align-items-center">
              <p>
                {user.isPublic != true && <FaLock />}
              </p>
              <h2>{user.userName}</h2>
            </div>
            <NavLink to="/profile/settings">
              <FaSlidersH className="menu-icon" />
            </NavLink>
          </div>
          <div className="stats">
            <div>
              <strong>{myTrips.length}</strong>
              <span>Trips</span>
            </div>
            <div>
              <strong>{user.followers?.length || 0}</strong>
              <span>Followers</span>
            </div>
            <div>
              <strong>{user.following?.length || 0}</strong>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>
      <p>{user.bio}</p>
      <div className="profile-buttons">
        <NavLink to='/profile/editProfile'>
          <button>Edit Profile</button>
        </NavLink>
        <button>Share Profile</button>
      </div>
      <div className="profile-tabs">
        <button>
          <i className="bi bi-grid-3x3-gap"></i>
        </button>
        <button>
          <i className="bi bi-bookmark"></i>
        </button>
        <button>
          <i className="bi bi-heart"></i>
        </button>
      </div>
      <div className="trip-grid">

        {myTrips.map(trip => (
          <img
            key={trip._id}
            src={`https://backend-r2uw.onrender.com/uploads/${trip.coverImage}`}
          />
        ))}

      </div>

    </div>
  );
}

export default Profile;