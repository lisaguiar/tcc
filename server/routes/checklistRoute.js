import express from 'express'
import { 
    deleteChecklist, 
    getChecklist, 
    patchChecklist, 
    postChecklist 
} from '../controllers/checklistController.js'
import authenticateToken from '../middleware/auth.js'
import validateParams from '../middleware/params.js'
import validateFields from '../middleware/body.js'

const router = express.Router()

router.get('/:fra_id', validateParams, getChecklist)
router.post('/:fra_id/:uda_id', authenticateToken, validateParams, validateFields, postChecklist)
router.patch('/patch/:fra_id/:che_id', authenticateToken, validateParams, validateFields, patchChecklist)
router.patch('/delete/:fra_id/:che_id', authenticateToken, validateParams, deleteChecklist)

export default router