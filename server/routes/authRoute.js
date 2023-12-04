import express from 'express'
import { register, login, logout, desktop } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/desktop/:use_id/:des_id', desktop)

export default router