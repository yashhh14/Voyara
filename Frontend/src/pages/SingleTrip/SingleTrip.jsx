import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useApi from '../../customeHooks/useApi';
import './singletrip.css'
import profile from '../../assets/profile.png'
import Loader from "../../components/Loader/Loader";


const SingleTrip = () => {
    const [loading, setLoading] = useState(true);
    const { tripId } = useParams();
    const { Api, setData } = useApi()
    const [trip, setTrip] = useState(null);
    useEffect(() => {
        async function getTrip() {
            const res = await Api(`https://backend-r2uw.onrender.com/trip/${tripId}`, "get");
            setLoading(false)
            setTrip(res);
        }
        getTrip();
    }, []);
    if (loading) {
        return <Loader />
    }
    return (
        <div className="single-trip">
            <div className="trip-cover">
                <img src={`https://backend-r2uw.onrender.com/uploads/${trip.coverImage}`} alt="" />
                <div className="cover-overlay2">
                    <h1>{trip.title}</h1>
                    <div className="trip-user">
                        <img src={trip.user.profilePic ? `https://backend-r2uw.onrender.com/uploads/${trip.user.profilePic}` : profile} alt="" />
                        <div>
                            <h4>{trip.user.userName}</h4>
                            <span>{trip.days.length} Days Journey</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="trip-stats">
                <div>
                    <h2>{trip.days.length}</h2>
                    <p>Days</p>
                </div>
                <div>
                    <h2>
                        ₹
                        {trip.days.reduce(
                            (sum, day) => sum + day.expenses,
                            0
                        )}
                    </h2>
                    <p>Expenses</p>
                </div>
                <div>
                    <h2>
                        {trip.days.reduce(
                            (sum, day) => sum + day.images.length,
                            0
                        )}
                    </h2>
                    <p>Photos</p>
                </div>
            </div>
            <div className="timeline">
                {trip.days.map((day) => (
                    <div className="day-card" key={day._id}>
                        <div className="day-header">
                            <div className="day-circle">
                                {day.dayNo}
                            </div>
                            <div>
                                <h2>Day {day.dayNo}</h2>
                                <p>📍 {day.location}</p>
                            </div>
                        </div>
                        <div className="day-images">
                            {day.images.map((img) => (
                                <img
                                    key={img}
                                    src={`https://backend-r2uw.onrender.com/uploads/${img}`}
                                    alt=""
                                />
                            ))}
                        </div>
                        <div className="day-details">
                            <p>
                                <strong>Hotel :</strong>{" "}
                                {day.hotel}
                            </p>
                            <p>
                                <strong>Expenses :</strong> ₹
                                {day.expenses}
                            </p>
                            <p className="caption">
                                {day.caption}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="summary-card">
                <h2>Journey Summary</h2>
                <div className="summary-grid">
                    <div>
                        <h3>{trip.days.length}</h3>
                        <span>Total Days</span>
                    </div>
                    <div>
                        <h3>
                            ₹
                            {trip.days.reduce(
                                (sum, day) => sum + day.expenses,
                                0
                            )}
                        </h3>
                        <span>Total Expense</span>
                    </div>
                    <div>
                        <h3>
                            {trip.days.reduce(
                                (sum, day) =>
                                    sum + day.images.length,
                                0
                            )}
                        </h3>
                        <span>Photos</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default SingleTrip