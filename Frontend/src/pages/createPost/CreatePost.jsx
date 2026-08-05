import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useApi from "../../customeHooks/useApi";
import { FaTimes } from "react-icons/fa";
import './createPost.css'

const CreatePost = () => {
  const navigate = useNavigate()
  const { apiData, Api } = useApi();
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  let [post, setPost] = useState({
    title: "",
    destination: "",
    image: "",
    date: "",
    user: decoded.id
  })
  async function createPostSubmit() {
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("destination", post.destination);
    formData.append("coverImage", post.image);
    formData.append("id", post.user);
    const res = await Api("http://localhost:8080/createTrip", "post", formData);
    console.log(res);
    navigate("/myTrips");
  }

  function fromHandle(e) {
    setPost({ ...post, [e.target.name]: e.target.value })
  }
  function handleClose(){
    navigate('/myTrips')
  }
  function handleImage(e) {
    setPost({
      ...post,
      image: e.target.files[0]
    });
  }
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card border-0 shadow-lg rounded-4">
            <div className="card-body p-5">
              <button onClick={handleClose} className="closeee">
                <FaTimes color="#333" size={20} />
              </button>
              <h2 className="fw-bold text-center mb-2">
                Create a Journey
              </h2>
              <p className="text-center text-muted mb-5">
                Begin documenting your next adventure.
              </p>
              <div className="mb-4">
                <label className="form-label fw-semibold"  >
                  Trip Title
                </label>
                <input type="text" value={post.title} className="form-control form-control-lg" placeholder="e.g. Trip to Tirupati" onChange={fromHandle} name="title" />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Destination
                </label>
                <input type="text" name="destination" value={post.destination} className="form-control form-control-lg" placeholder="e.g. Andhra Pradesh, India" onChange={fromHandle} />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Cover Image
                </label>
                <input type="file" name="image" className="form-control form-control-lg" onChange={handleImage} />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Journey Start Date
                </label>
                <input name="date" onChange={fromHandle} value={post.date} type="date" className="form-control form-control-lg" />
              </div>
              <button onClick={createPostSubmit} className="btn btn-primary btn-lg w-100 rounded-3 py-3 fw-semibold">
                Start Trip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;