import React, { useContext, useEffect, useState } from "react";
import useApi from "../../customeHooks/useApi";
import "./post.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import Shimmer from "../Shimmer/Shimmer";
import profile from '../../assets/profile.png'
import { CurrentUserContext } from "../../customeHooks/useContext";

const Post = () => {
    const token = localStorage.getItem("token");
    const { Api } = useApi();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [trips, setTrips] = useState([]);
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext)
    async function tripss() {
        const res = await Api("https://backend-r2uw.onrender.com/trips", "get",);
        const filRes = res.filter((trip) => {
            return trip.days != 0 
        })
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        

        setTrips(filRes);
    }
    async function followUser(id) {
        try {
            const res = await Api(`https://backend-r2uw.onrender.com/followUser/${id}`, "post", {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        } catch (err) {
            console.log(err);
        }
    }
    function SingleTrip(id) {
        navigate(`/trip/${id}`);
    }
    useEffect(() => {
        tripss()
    }, []);
    if (loading) {
        return <Shimmer />
    }
    if (trips.length == 0) {
        return
    }
    return (
        <div className="feed-container">
            {trips.map((post) => {
                const isMe = post.user._id === currentUser.id;
                const isFollowing = currentUser?.following?.includes(post.user._id);
                const now = Date.now();
                const past = new Date(post.createdAt)
                const differenceInMs = now - past;
                const totalSeconds = Math.floor(differenceInMs / 1000);
                const totalMinutes = Math.floor(differenceInMs / (1000 * 60));
                const totalHours = Math.floor(differenceInMs / (1000 * 60 * 60));
                const totalDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
                let dif = 0
                if (totalSeconds < 60) {
                    dif = `${totalSeconds}s`
                }
                else if (totalMinutes < 60) {
                    dif = `${totalMinutes}m`
                } else if (totalHours < 24) {
                    dif = `${totalHours}h`
                } else {
                    dif = `${totalDays}d`
                }
                return (
                    <div className="travel-post" key={post._id}>
                        <div className="travel-header">
                            <div className="user-details">
                                <img src={post.user?.profilePic ? `https://backend-r2uw.onrender.com/uploads/${post.user.profilePic}` : profile} alt="" className="postCoverImg" />                                <div>
                                    <h5>{post.user.userName}</h5>
                                    <small>{dif}</small>
                                </div>
                            </div>
                            {!isMe && !isFollowing && (
                                <button className="btn btn-primary" onClick={() => followUser(post.user._id)} >
                                    Follow
                                </button>
                            )}

                            {!isMe && isFollowing && (
                                <button className="btn btn-outline-secondary" disabled >
                                    Following
                                </button>
                            )}
                        </div>
                        <div className="travel-cover">
                            <img src={`https://backend-r2uw.onrender.com/uploads/${post.coverImage}`} alt="" />
                        </div>
                        <div className="travel-stats">
                            <div className="cover-overlay">
                                <h5>
                                    {post.days.length}
                                </h5>
                                <small>{post.days.length == 1 ? "Day" : "Days"}</small>
                            </div>
                            <div>
                                <h5>
                                    {post.days.length}
                                </h5>
                                <small>{post.days.length == 1 ? "Place" : "Places"}</small>
                            </div>
                            <div>
                                <h5>{
                                    post.days.reduce(
                                        (sum, day) => sum + day.images.length,
                                        0
                                    )
                                }
                                </h5>
                                <small>Photos</small>
                            </div>
                            <div>
                                <h5>₹{post.days.reduce(
                                    (sum, day) => sum + Number(day.expenses),
                                    0
                                )
                                }
                                </h5>
                                <small>Expenses</small>
                            </div>
                            <button className="btn btn-primary" onClick={(id) => SingleTrip(post._id)}>view Trip Details</button>
                        </div>
                        <h3>{post.title}</h3>
                        <div className="travel-caption">
                            <p>
                                <b>{post.user.userName} </b>
                                📍{post.destination}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default React.memo(Post);