import { useEffect } from 'react'
import axios from '../api/axios'

export const Token = () => {
  useEffect(() => {
    const logout = async () => {
        await axios.post("/api/logout")
    }
    
    const tokenCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token'))
    console.log(tokenCookie)
    if (!tokenCookie) {
        logout()
    }
  }, [])

}