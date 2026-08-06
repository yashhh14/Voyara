import React, { useEffect, useState } from "react";
import axios from "axios";
import "./friends.css";
import defaultAvatar from "../../assets/profile.png";
import useApi from "../../customeHooks/useApi";
import profile from '../../assets/profile.png'
import { useNavigate } from "react-router-dom";

const Friends = () => {
  const [post, setPost] = useState([]);
  const { Api, setData } = useApi()
  const navigate = useNavigate()
  const token = localStorage.getItem("token");
  async function getFriendsPosts() {
    try {
      const res = await Api("https://backend-r2uw.onrender.com/friendsPosts", "get",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const filRes = res.filter((trip) => trip.days.length > 0);
      setPost(filRes);

    } catch (err) {
      console.log(err);
    }
  }
  function SingleTrip(id) {
    navigate(`/trip/${id}`);
  }
  useEffect(() => {
    getFriendsPosts();
  }, []);
  if (post.length === 0) {
    return (
      <div className="empty-feed">
        <i className="bi bi-people"></i>
        <h3>No Friend Posts Yet</h3>
        <p>Follow travelers to see their journeys here.</p>
      </div>
    );
  }

  return (
    <div className="friends-feed">
      {post.map((trip) => (
        <div className="travel-post" key={trip._id}>
          <div className="travel-header">
            <div className="user-details">
              <img
                src={
                  trip.user?.profilePic
                    ? `https://backend-r2uw.onrender.com/uploads/${trip.user.profilePic}`
                    : profile
                }
                alt=""
                className="postCoverImg"
              />

              <div>
                <h5>{trip.user.userName}</h5>
              </div>
            </div>
          </div>

          <div className="travel-cover">
            <img
              src={`https://backend-r2uw.onrender.com/uploads/${trip.coverImage}`}
              alt=""
            />
          </div>

          <div className="travel-stats">
            <div>
              <h5>{trip.days.length}</h5>
              <small>{trip.days.length === 1 ? "Day" : "Days"}</small>
            </div>

            <div>
              <h5>{trip.days.length}</h5>
              <small>{trip.days.length === 1 ? "Place" : "Places"}</small>
            </div>

            <div>
              <h5>
                {trip.days.reduce(
                  (sum, day) => sum + day.images.length,
                  0
                )}
              </h5>
              <small>Photos</small>
            </div>

            <div>
              <h5>
                ₹
                {trip.days.reduce(
                  (sum, day) => sum + Number(day.expenses),
                  0
                )}
              </h5>
              <small>Expenses</small>
            </div>
            <button className="btn btn-primary" onClick={() => SingleTrip(trip._id)} >
              View Trip Details
            </button>
          </div>

          <h3>{trip.title}</h3>

          <div className="travel-caption">
            <p>
              <b>{trip.user.userName}</b> 📍 {trip.destination}
            </p>
          </div>


        </div>
      ))}
    </div>
  );
};

export default Friends;