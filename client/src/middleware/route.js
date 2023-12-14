import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'

export const AuthenticatedRoute = ({ element }) => {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate])

  return currentUser ? element : null
}

export const UnauthenticatedRoute =({ element }) => {
    const { currentUser } = useContext(AuthContext)
    const navigate = useNavigate()
  
    useEffect(() => {
      if (currentUser) {
        const uda_id = currentUser.uda_id

        navigate(`/u/${uda_id}/boards`)
      }
    }, [currentUser, navigate])
   
    return currentUser ? null : element
}