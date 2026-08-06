import React, { useEffect, useState } from 'react'
import './home.css'
import Post from '../../components/posts/Post'
import title from "../../assets/title.png";
import { FaPlus, FaHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate()
    const [showLogo, setShowLogo] = useState(false);
    const [lastScroll, setLastScroll] = useState(0);

    function handleScroll(e) {
        const current = e.currentTarget.scrollTop;
        const diff = current - lastScroll;

        if (diff >= 25) {
            setShowLogo(true);
            setLastScroll(current);
        }

        if (diff <= -5) {
            setShowLogo(false);
            setLastScroll(current);
        }
    }
    function handleCreatePost() {
        navigate('/createPost')
    }
    useEffect(() => {
        if (scroll > 50) {
            console.log("User scrolled past 50px");
        }
    }, [scroll]);
    return (
        <>
            <div onScroll={(e) => handleScroll(e)} style={{ height: '100vh', overflowY: 'auto' }}>
                <div className={`titleDiv ${showLogo ? "" : "show"}`}>
                    <button className="addPost" onClick={handleCreatePost}>
                        <FaPlus className="footMenu-icon" />
                    </button>
                    <img src={title} alt="" className='titlelogo' />
                    <button className="likesIcon">
                        <FaHeart className="footMenu-icon" />
                    </button>
                </div>
                <Post />
            </div>
        </>
    )
}

export default React.memo(Home)