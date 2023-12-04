import express from "express"
import { getPriority } from "../controllers/priorityController.js"

const router = express.Router()

router.get('/', getPriority)

export default router