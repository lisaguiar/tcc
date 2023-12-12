import express from 'express'
import { 
    getFavorites, 
    addFavorite, 
    deleteFavorite 
} from '../controllers/favoriteController.js'
import validateParams from '../middleware/params.js'
import authenticateToken from '../middleware/auth.js'

const router = express.Router()

router.get('/:uda_id', authenticateToken, validateParams, getFavorites)
router.post('/:uda_id/:fra_id', authenticateToken, validateParams, addFavorite)
router.patch('/:fra_id', authenticateToken, validateParams, deleteFavorite)

export default router