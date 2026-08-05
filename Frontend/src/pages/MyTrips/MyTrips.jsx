import React, { useContext, useEffect, useState } from 'react'
import useApi from '../../customeHooks/useApi'
import './myTrips.css'
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'

const MyTrips = () => {
  const token = localStorage.getItem("token");
  const { Api, setData } = useApi()
  const [myTrips,setMyTrips]=useState([])
  const navigate = useNavigate()
  function handleCreatePost() {
    navigate('/createpost')
  }
  async function tripsData() {
    const res = await Api("https://backend-r2uw.onrender.com/myTrips", "get",{},
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
  }, [])
  return (
    <>
      <div className="container py-4">
        {myTrips.length === 0 && <button className="addPost" onClick={handleCreatePost}>
          <FaPlus className="footMenu-icon" />
        </button>}
        <div className="row">
          {myTrips.map((trip) => (
            <div className="col-lg-4 col-md-6 mb-4" key={trip._id}>
              <div className="card shadow border-0 rounded-4 h-100">
                <img
                  src={`https://backend-r2uw.onrender.com/uploads/${trip.coverImage}`}
                  className="card-img-top"
                  style={{
                    height: "220px",
                    objectFit: "cover"
                  }}
                  alt=""
                />
                <div className="card-body">
                  <h4 className="fw-bold">
                    {trip.title}
                  </h4>
                  <p className="text-secondary mb-2">
                    📍 {trip.destination}
                  </p>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{trip.days.length}</strong>
                      <br />
                      <small>Days</small>
                    </div>
                    <div>
                      <strong>{trip.likes.length}</strong>
                      <br />
                      <small>Likes</small>
                    </div>
                    <div>
                      <strong>{trip.comments.length}</strong>
                      <br />
                      <small>Comments</small>
                    </div>
                  </div>
                  <hr />
                  <small className="text-muted">
                    Started on{" "}
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <div className="card-footer bg-white border-0">
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/trip/${trip._id}/add-day`)}
                    >
                      ➕ Add Day
                    </button>
                    <button
                      className="btn btn-outline-danger"
                    >
                      🏁 End Trip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default MyTrips