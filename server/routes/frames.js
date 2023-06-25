import express from 'express'
import { getAllFrames, getFrame } from '../controllers/frames.js'

const router = express.Router()

router.get('/all/:pro_id', getAllFrames)
router.get('/:pro_id/:fra_id', getFrame)

export default router