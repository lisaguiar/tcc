import express from 'express'
import { 
    deleteNotification, 
    getNotifications 
} from '../controllers/notificationController.js'
import authenticateToken from '../middleware/auth.js'
import validateParams from '../middleware/params.js'

const router = express.Router()

router.get('/:uda_id', authenticateToken, validateParams, getNotifications)
router.patch('/delete/:uda_id/:che_id', authenticateToken, validateParams, deleteNotification)

export default router