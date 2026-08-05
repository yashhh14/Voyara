import title from "../../assets/title.png";
import { NavLink, useNavigate } from "react-router-dom";
import "./sidebarnav.css";
import {
    FaHome,
    FaSearch,
    FaSuitcaseRolling,
    FaUserFriends,
    FaPlus,
    FaRegCommentAlt,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";
import { useEffect } from "react";

function SideNav() {
    const navigate = useNavigate()
    const getClassName = ({ isActive }) =>
        isActive ? "menu-item active-link" : "menu-item";
    function handleCreatePost() {
        navigate('/createpost')
    }
    useEffect(() => {
    }, [])

    return (
        <>
            <aside className="sidebar">
                <img src={title} className="logo" alt="Voyara" />
                <nav className="menu">
                    <button className="sidebar-btn sidebar-btn-primary" onClick={handleCreatePost}>
                        <FaPlus className="menu-icon" />
                        Create
                    </button>
                    <NavLink to="/" className={getClassName}>
                        <FaHome className="menu-icon" />
                        Home
                    </NavLink>
                    <NavLink to="/search" className={getClassName}>
                        <FaSearch className="menu-icon" />
                        Search
                    </NavLink>
                    <NavLink to="/myTrips" className={getClassName}>
                        <FaSuitcaseRolling className="menu-icon" />
                        My Trips
                    </NavLink>
                    <NavLink to="/friends" className={getClassName}>
                        <FaUserFriends className="menu-icon" />
                        Friends
                    </NavLink>
                    <NavLink to="/messages" className={getClassName}>
                        <FaRegCommentAlt className="menu-icon" />
                        Messages
                    </NavLink>
                    <NavLink to="/profile" className={getClassName}>
                        <FaUser className="menu-icon" />
                        Profile
                    </NavLink>
                </nav>
            </aside>
        </>
    )
}

export default SideNav;