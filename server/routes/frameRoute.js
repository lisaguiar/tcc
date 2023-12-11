import express from 'express'
import { deleteFrame, getFrames, patchFrame, postFrame } from '../controllers/frameController.js'

const router = express.Router()

router.get('/:pro_id/:fra_id', getFrames)
router.post('/:pro_id/:uda_id/', postFrame)
router.patch('/patch/:pro_id/:fra_id', patchFrame)
router.patch('/delete/:pro_id/:fra_id', deleteFrame)

export default router