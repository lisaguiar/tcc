import { useContext } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { AuthContext } from "../contexts/authContext"

export const NaoLogado = () => {
    const { currentUser } = useContext(AuthContext)

    return (
        currentUser ? <Navigate to='/boards'/> : ""
    )
}

export const Logado = () => {
    const { currentUser } = useContext(AuthContext)

    return (
        currentUser ? "" : <Navigate to='/'/>
    )
}