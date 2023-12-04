import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token
  const SECRET_KEY = process.env.SECRET_KEY

  if (!token) {
    return res.status(401).json({ error: 'Token inexistente.' })
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido.' })
    }

    req.user = user
    next() 
  })
}