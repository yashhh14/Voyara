import { useContext, useState } from "react";
import axios from "axios";
import "./editProfile.css";
import defaultProfile from "../../assets/profile.png";
import useApi from "../../customeHooks/useApi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function EditProfile() {
    const token = localStorage.getItem("token");
    const { Api, setData } = useApi()
    const navigate = useNavigate()
    const [user, setUser] = useState({});
    const [userName, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    async function getProfile() {
        const res = await Api("http://localhost:8080/profile", "get",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setUser(res);
        setUserName(res.userName);
        setBio(res.bio);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("userName", userName);
        formData.append("bio", bio);
        if (profilePic) {
            formData.append("profilePic", profilePic);
        }
        try {
            const res = await Api("http://localhost:8080/updateProfile", "put", formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUser(res.user);
            alert("Profile Updated");
            navigate('/profile')

        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
    }
    useEffect(() => {
        getProfile()
    }, [])
    return (
        <div className="edit-profile">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="profile-image">
                    <img src={profilePic ? URL.createObjectURL(profilePic) : user.profilePic ? `http://localhost:8080/uploads/${user.profilePic}` : defaultProfile} alt="" />
                    <input type="file" accept="image/*" onChange={(e) => setProfilePic(e.target.files[0])} />
                </div>
                <label>Username</label>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} disabled/>
                <label>Bio</label>
                <textarea rows="5" value={bio} onChange={(e) => setBio(e.target.value)} />
                <button type="submit">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditProfile;