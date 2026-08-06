import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useApi from "../..//src/customeHooks/useApi";
import profile from '../../src/assets/profile.png';

function UserProfile() {
    const { id } = useParams();
    const { Api } = useApi();
    const [user, setUser] = useState({});
    const [userTrips, setUserTrips] = useState([]);
    useEffect(() => {
        async function getUser() {
            const res = await Api(`https://backend-r2uw.onrender.com/search/${id}`,"get");
            setUser(res.user);
            setUserTrips(res.trips);
        }
        getUser();
    }, []);
    if (!user._id) {
        return <h2>Loading...</h2>;
    }
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
                    </div>
                    <div className="stats">
                        <div>
                            <strong>{userTrips.length}</strong>
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
                <button>Follow</button>
            </div>
            <div className="profile-tabs">
                <button>
                    <i className="bi bi-grid-3x3-gap"></i>
                </button>
            </div>
            <div className="trip-grid">

                {
                    userTrips.map(trip => (

                        <img
                            key={trip._id}
                            src={`https://backend-r2uw.onrender.com/uploads/${trip.coverImage}`}
                            alt={trip.title}
                        />

                    ))
                }

            </div>

        </div>
    );
}

export default UserProfile;