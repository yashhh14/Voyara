import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./app.css";
import SideNav from "./components/SideBarNav/SideNav";
import Nav from "./components/PhoneNav/Nav";
import Home from "./pages/Home/Home";
import MyTrips from "./pages/MyTrips/MyTrips";
import Friends from "./pages/Friends/Friends";
import Login from "./pages/loginSignup/Login";
import Signup from "./pages/loginSignup/Signup";
import axios from 'axios'
import CreatePost from "./pages/createPost/CreatePost";
import Search from "./pages/Search/Search";
import Profile from "./pages/Profile/Profile";
import Messages from "./pages/Messages/Messages";
import Settings from "./pages/Settings/Settings";
import AddDay from "./components/AddDay";
import EditProfile from "./components/EditProfile/EditProfile";
import { AuthProvider } from './customeHooks/useContext.jsx';
import SingleTrip from "./pages/SingleTrip/SingleTrip.jsx";
import UserProfile from "./components/UserProfile.jsx";



function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [width, setWidth] = useState(window.innerWidth);
  async function verifyUser() {
    try {
      if (!token) {
        navigate('/login')
        return
      } else {
        const res = await axios.get('https://backend-r2uw.onrender.com/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
    } catch (err) {
      localStorage.removeItem("token");
    } finally {
    }
  }
  setTimeout(() => {
    localStorage.removeItem('token')
  }, 30 * 60 * 1000);
  useEffect(() => {
    verifyUser();
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [])
  return (
    <AuthProvider>
      <div className="app">
        <div className="barrs">
          {token && (width <= 600 ? <Nav /> : <SideNav />)}
        </div>
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/myTrips" element={<MyTrips />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/settings" element={<Settings />} />
            <Route path="/profile/editProfile" element={<EditProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/trip/:tripId/add-day" element={<AddDay />} />
            <Route path="/trip/:tripId" element={<SingleTrip />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/trip/:id" element={<SingleTrip />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
export default App;