import { NavLink, useNavigate } from "react-router-dom";
import "./nav.css";
import {
    FaHome,
    FaSearch,
    FaSuitcaseRolling,
    FaUserFriends,
    FaPlus,
    FaRegCommentAlt,
    FaBell,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";
import { useEffect } from "react";

function Nav() {
    const navigate = useNavigate()
    const getClassName = ({ isActive }) =>
        isActive ? "footMenu-item active-link" : "footMenu-item";
    function handleCreatePost() {
        navigate('/createpost')
    }
    useEffect(() => {
    }, [])

    return (
        <>
            <aside className="footNav">
                <nav className="footMenu">
                    <NavLink to="/" className={getClassName}>
                        <FaHome className="footMenu-icon" />
                    </NavLink>
                    <NavLink to="/friends" className={getClassName}>
                        <FaUserFriends className="menu-icon" />
                    </NavLink>
                    <NavLink to="/search" className={getClassName}>
                        <FaSearch className="footMenu-icon" />
                    </NavLink>
                    <NavLink to="/myTrips" className={getClassName}>
                        <FaSuitcaseRolling className="footMenu-icon" />
                    </NavLink>
                    <NavLink to="/messages" className={getClassName}>
                        <FaRegCommentAlt className="footMenu-icon" />
                    </NavLink>
                    <NavLink to="/profile" className={getClassName}>
                        <FaUser className="footMenu-icon" />
                    </NavLink>
                </nav>
            </aside>
        </>
    )
}

export default Nav;