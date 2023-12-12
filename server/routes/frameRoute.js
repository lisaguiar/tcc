import express from 'express'
import { 
    deleteFrame, 
    getFrame, 
    getFrames, 
    patchFrame,
    postFrame 
} from '../controllers/frameController.js'
import authenticateToken from '../middleware/auth.js'
import validateParams from '../middleware/params.js'
import validateFields from '../middleware/body.js'

const router = express.Router()

router.get('/:pro_id', authenticateToken, validateParams, getFrames)
router.get('/:pro_id/:fra_id', authenticateToken, validateParams, getFrame)
router.post('/:pro_id/:uda_id', authenticateToken, validateParams, validateFields, postFrame)
router.patch('/patch/:pro_id/:fra_id', authenticateToken, validateParams, validateFields, patchFrame)
router.patch('/delete/:pro_id/:fra_id', authenticateToken, validateParams, deleteFrame)

export default router