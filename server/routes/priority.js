import express from "express"
import { getPriority } from "../controllers/priority.js"

const router = express.Router()

router.get('/', getPriority)

export default router