import express from 'express'
import { register, login, logout, handleToken, getDesktop, getProject } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/token', handleToken)
router.get('/desktop/:pro_id', getDesktop)
router.get('/project/:fra_id', getProject)

export default router