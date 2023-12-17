import express from 'express'
import { 
    deleteMember, 
    getMember, 
    patchMember, 
    postMember 
} from '../controllers/memberController.js'
import authenticateToken from '../middleware/auth.js'
import validateParams from '../middleware/params.js'
import validateFields from '../middleware/body.js'

const router = express.Router()

router.get('/:uda_id', authenticateToken, validateParams, getMember)
router.post('/:des_id', authenticateToken, validateParams ,validateFields, postMember)
router.patch('/patch/:des_id/:uda_id', authenticateToken, validateParams, validateFields, patchMember)
router.patch('/delete/:des_id/:uda_id', authenticateToken, validateParams, deleteMember)

export default router