import express from 'express'
import { 
    getKanbanTable, 
    getKanbanCard, 
    patchPositionCard, 
    patchCard, 
    postTable, 
    patchTable, 
    deleteCard, 
    deleteTable, 
    postCard 
} from '../controllers/kanbanController.js'
import authenticateToken from '../middleware/auth.js'
import validateParams from '../middleware/params.js'
import validateFields from '../middleware/body.js'

const router = express.Router()

router.get('/table/:fra_id', authenticateToken, validateParams, getKanbanTable)
router.get('/card/:fra_id', authenticateToken, validateParams, getKanbanCard)
router.post('/table/:fra_id/:uda_id', authenticateToken, validateParams, validateFields, postTable)
router.post('/card/:fra_id/:uda_id/:kat_id', authenticateToken, validateParams, validateFields, postCard)
router.patch('/card', authenticateToken, validateParams, validateFields, patchPositionCard)
router.patch('/card/patch/:fra_id/:kac_id', authenticateToken, validateParams, validateFields, patchCard)
router.patch('/table/patch/:fra_id/:kat_id', authenticateToken, validateParams, validateFields, patchTable)
router.patch('/card/delete/:fra_id/:kac_id', authenticateToken, validateParams, deleteCard)
router.patch('/table/delete/:fra_id/:kat_id', authenticateToken, validateParams, deleteTable)

export default router