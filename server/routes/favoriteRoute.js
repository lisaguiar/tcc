import express from 'express'
import { getFavorites, addFavorite, deleteFavorite } from '../controllers/favoriteController.js'

const router = express.Router()

router.get("/:uda_id", getFavorites)
router.post("/:uda_id/:fra_id", addFavorite)
router.patch("/:fra_id", deleteFavorite)

export default router