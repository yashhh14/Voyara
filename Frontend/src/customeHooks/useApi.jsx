import axios from 'axios'
import React, { useEffect, useState } from 'react'

const useApi = () => {
    const [apiData, setApiData] = useState(null)
    const token = localStorage.getItem("token");

    async function Api(url, Method, data = {}, config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }) {
        console.log(url, Method, config.headers);
        try {
            if (Method == "get") {
                const res = await axios.get(`${url}`, config)
                console.log(config);
                return res.data
            }
            if (Method == "post") {
                const res = await axios.post(`${url}`, data, config)
                return res.data
            }
            if (Method == "patch") {
                const res = await axios.patch(`${url}`, data)
                return res.data
            }
            if (Method == "put") {
                console.log(data, config);
                const res = await axios.put(`${url}`, data, config)
                return res.data
            }
        } catch (err) {
            throw (err)
        } finally {
        }
    }
    return { apiData, Api };
}

export default useApi