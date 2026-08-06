import { createContext, useEffect, useState } from "react";
import useApi from "./useApi";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


export const AuthContext = createContext();
export const CurrentUserContext = createContext();

export function AuthProvider({ children }) {
    const token = localStorage.getItem("token");
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [trips, setTrips] = useState([]);
    const { Api } = useApi();
    function userValid() {
        const res = jwtDecode(token);
        setCurrentUser(res)
    }
    async function tripss() {
        const res = await Api("https://backend-r2uw.onrender.com/trips", "get",);
        const filRes = res.filter((trip) => {
            return trip.days != 0
        })
        setTrips(filRes);
    }
    setInterval(() => {
        userValid()
        tripss()
    }, 1000 * 60 * 10)
    useEffect(() => {
        if (!token) {
            return navigate('/login')
        }
        userValid()
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
                <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
                    {children}
                </CurrentUserContext.Provider>
        </AuthContext.Provider>
    );
}