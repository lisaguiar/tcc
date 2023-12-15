import express from 'express'
import { register, login, logout, desktop, handleToken } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/token', handleToken)

export default router