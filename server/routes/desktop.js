import express from 'express'
import { deleteDesktop, getDesktop, getLastDesktop, patchDesktop, postDesktop } from '../controllers/desktop.js'

const router = express.Router()

router.get('/all/:use_id', getDesktop)
router.get('/:des_id', getLastDesktop)
router.post('/post/:use_id', postDesktop)
router.patch('/patch/:uda_id/:des_id', patchDesktop)
router.patch('/delete/:uda_id/:des_id', deleteDesktop)

export default router