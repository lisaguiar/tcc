import express from 'express'
import { getAllDesktop, getLastDesktop, patchDesktop, postDesktop } from '../controllers/desktop.js'

const router = express.Router()

router.get('/all/:use_id', getAllDesktop)
router.get('/:des_id', getLastDesktop)
router.post('/post/:use_id', postDesktop)
router.patch('/patch/:des_id', patchDesktop)

export default router