import { createContext, useEffect, useState } from 'react'
import axios from '../api/axios'

export const AuthContext = createContext()

export const AuthContextProvider = ({children})=> {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user') || null))

    const login = async (inputs) => {
        const res = await axios.post("/api/login", inputs)
        const userData = res.data
        
        setCurrentUser(userData)
    }

    const logout = () => {
        axios.post("/api/logout")
        setCurrentUser(null)
    }

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(currentUser))
    }, [currentUser])

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    )
}