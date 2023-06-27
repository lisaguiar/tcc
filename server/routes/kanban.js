import express from 'express'
import { getKanbanTable, getKanbanCard, patchPositionCard, patchCard, postTable, patchTable, deleteCard, deleteTable } from '../controllers/kanban.js'

const router = express.Router()

router.get('/table/:fra_id', getKanbanTable)
router.get('/card/:fra_id', getKanbanCard)
router.post('/table/:uda_id/:fra_id', postTable)
router.patch('/card', patchPositionCard)
router.patch('/card/patch/:kac_id', patchCard)
router.patch('/table/patch/:kat_id', patchTable)
router.patch('/card/delete/:kac_id', deleteCard)
router.patch('/table/delete/:kat_id', deleteTable)

export default router