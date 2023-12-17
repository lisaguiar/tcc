import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/auth'
import axios from '../api/axios'

const logout = async () => {
  await axios.post("/api/logout")
}

export const AuthenticatedRoute = ({ element }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  
  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.get('/api/token')
        const token = res.data.token || null

        if (!token) {
          await logout()
          await setCurrentUser(null)
        }
      } catch (err) {
        console.log(err.response.data.error)
      }
    }
    getToken()

    if (!currentUser) {
      navigate('/')
    }
  }, [currentUser, navigate, setCurrentUser])

  return currentUser ? element : null
}

export const UnauthenticatedRoute = ({ element }) => {
    const { currentUser, setCurrentUser } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
      const getToken = async () => {
        try {
          const res = await axios.get('/api/token')
          const token = res.data.token || null

          if (currentUser && token) {
            const use_id = currentUser.use_id

            navigate(`/u/${use_id}/boards`)
          } else {
            await logout()
            await setCurrentUser(null)
          }
        } catch (err) {
          console.log(err.response.data)
        }
      }
      getToken()
    }, [currentUser, navigate, setCurrentUser])
   
    return currentUser ? null : element
}