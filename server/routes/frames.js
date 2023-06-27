import express from 'express'
import { deleteFrame, getAllFrames, getFrame, patchFrame, postFrame } from '../controllers/frames.js'

const router = express.Router()

router.get('/all/:pro_id', getAllFrames)
router.get('/one/:pro_id/:fra_id', getFrame)
router.post('/post/:uda_id/:pro_id', postFrame)
router.patch('/patch/:fra_id', patchFrame)
router.patch('/delete/:fra_id', deleteFrame)

export default router