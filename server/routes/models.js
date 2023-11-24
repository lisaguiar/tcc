import express from "express"
import { getModel } from "../controllers/models.js"

const router = express.Router()

router.get('/', getModel)

export default router