import React, { useEffect, useState } from "react";
import axios from "axios";
import "./friends.css";
import defaultAvatar from "../../assets/profile.png";
import useApi from "../../customeHooks/useApi";

const Friends = () => {
  const [posts, setPosts] = useState([]);
  const { Api, setData } = useApi()
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
      setPosts(res);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getFriendsPosts();
  }, []);
  if (posts.length === 0) {
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
      {posts.map((post) => (
        <div className="friend-post" key={post._id}>
          <div className="friend-header">
            <div className="friend-user">
              <img src={post.user.profilePic? `https://backend-r2uw.onrender.com/uploads/${post.user.profilePic}`: defaultAvatar} className="friend-avatar" alt=""/>
              <div>
                <h6>{post.user.userName}</h6>
                <small>{post.destination}</small>
              </div>
            </div>
            <button className="btn btn-light">
              <i className="bi bi-three-dots"></i>
            </button>
          </div>
          <img src={`https://backend-r2uw.onrender.com/uploads/${post.coverImage}`} className="friend-cover" alt="" />
          <div className="friend-body">
            <h5>{post.title}</h5>
            <p>{post.destination}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Friends;