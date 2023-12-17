import express from "express"
import { getModel } from "../controllers/modelController.js"
import authenticateToken from "../middleware/auth.js"

const router = express.Router()

router.get('/', authenticateToken, getModel)

export default router