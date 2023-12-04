import jwt from 'jsonwebtoken'

export const decodedToken = (token) => {
    const SECRET_KEY = process.env.SECRET_KEY

    if (!SECRET_KEY) {
        return null
    }
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        return decoded
    } catch (error) {
        return null
    }
}