import express from 'express'
import { getKanbanTable, getKanbanCard, patchPositionCard, patchCard, postTable, patchTable, deleteCard, deleteTable, postCard } from '../controllers/kanban.js'

const router = express.Router()

router.get('/table/:fra_id', getKanbanTable)
router.get('/card/:fra_id', getKanbanCard)
router.post('/table/:fra_id/:uda_id', postTable)
router.post('/card/:fra_id/:uda_id/:kat_id', postCard)
router.patch('/card', patchPositionCard)
router.patch('/card/patch/:fra_id/:kac_id', patchCard)
router.patch('/table/patch/:fra_id/:kat_id', patchTable)
router.patch('/card/delete/:fra_id/:kac_id', deleteCard)
router.patch('/table/delete/:fra_id/:kat_id', deleteTable)

export default router