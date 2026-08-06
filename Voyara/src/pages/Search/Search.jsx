import { useEffect, useState } from "react";
import useApi from "../../customeHooks/useApi";
import "./search.css";

function Search() {
    const { Api,setData } = useApi();
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [trips, setTrips] = useState([]);
    useEffect(() => {
        if (!query.trim()) {
            setUsers([]);
            setTrips([]);
            return;
        }
        const timer = setTimeout(async () => {
            const res = await Api(`https://backend-r2uw.onrender.com/search?q=${query}`,"get");
            setUsers(res.users);
            setTrips(res.trips);
        }, 1000);
        return () => clearTimeout(timer);
    }, [query]);
    return (
        <div className="search-page">
            <input type="text" className="search-box" placeholder="Search users, trips, destinations..." value={query} onChange={(e)=>setQuery(e.target.value)} />
            <h4>{users.length!=0 && 'Users'}</h4>
            {
                users.map(user=>(
                    <div className="user-card" key={user._id}>
                        <img src={user.profilePic ? `https://backend-r2uw.onrender.com/uploads/${user.profilePic}` : "/default-avatar.png" } />
                        <span>{user.userName}</span>
                    </div>
                ))
            }
            <h4>{trips.length!=0 && 'Trips'}</h4>
            {
              trips.map(trip=>(
                    <div className="trip-card" key={trip._id}>
                        <img src={`https://backend-r2uw.onrender.com/uploads/${trip.coverImage}`}/>
                        <div>
                            <h5>{trip.title}</h5>
                            <small>{trip.destination}</small>
                            <p>by {trip.user.userName}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default Search;