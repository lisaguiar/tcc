import { createContext, useEffect, useState } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthContextProvider = ({children})=> {
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user') || null))

    const login = async (inputs) => {
        const res = await axios.post("/api/login", inputs)
        const userData = res.data
        
        setCurrentUser(userData)
    }

    const logout = async (inputs) => {
        await axios.post("/api/logout")
        await setCurrentUser(null)
    }

    const checkUserPermission = async (inputs) => {
        const use_id = currentUser?.use_id
        const des_id = inputs

        try {
            const res = await axios.get(`/api/desktop/${use_id}/${des_id}`)
            const data = res.data

            if (data === null || data.length === 0 || !data.length) {
            console.log("Usuário não autorizado a acessar a página.")
            return false
            } else {
            console.log("Usuário autorizado a acessar a página.")
            return true
            }
        } catch (err) {
            return false
        }
        
      }

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(currentUser))
    }, [currentUser])

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, setCurrentUser, checkUserPermission }}>{children}</AuthContext.Provider>
    )
}