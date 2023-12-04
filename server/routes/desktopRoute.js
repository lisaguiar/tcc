import express from 'express'
import { param, validationResult } from 'express-validator'
import { authenticateToken } from '../middleware/auth.js'
import {
  deleteDesktop,
  getDesktop,
  getAll,
  patchDesktop,
  postDesktop,
} from '../controllers/desktopController.js'

const router = express.Router()

// Validação dos dados
const validateParams = (params) => {
    const validationRules = []

    if (params === 'use_id') {
        validationRules.push(
        param('use_id').isInt().withMessage('use_id deve ser um número inteiro')
        )
    } else if (params === 'use_des_id') {
        validationRules.push(
        param('use_id').isInt().withMessage('use_id deve ser um número inteiro'),
        param('des_id').isInt().withMessage('des_id deve ser um número inteiro')
        )
    }

    const validationMiddleware = [
        ...validationRules,
        (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
        }
    ]
    return validationMiddleware
}


// Rotas
router.get('/:use_id', authenticateToken, validateParams('use_id'), getDesktop)
//router.get('/one/:use_id/:des_id', authenticateToken, validateParams, getOneDesktop)
router.post('/:use_id', authenticateToken, validateParams('use_id'), postDesktop)
router.patch('/patch/:use_id/:des_id', authenticateToken, validateParams('use_des_id'), patchDesktop)
router.patch('/delete/:use_id/:des_id', authenticateToken, validateParams('use_des_id'), deleteDesktop)

export default router
