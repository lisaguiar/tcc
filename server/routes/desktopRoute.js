import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import {
  deleteDesktop,
  getDesktop,
  getOneDesktop,
  patchDesktop,
  postDesktop,
} from '../controllers/desktopController.js'
import validateFields from '../middleware/body.js'
import validateParams from '../middleware/params.js'

const router = express.Router()

router.get('/:use_id', authenticateToken, validateParams, getDesktop)
router.get('/:use_id/:des_id', authenticateToken, validateParams, getOneDesktop)
router.post('/:use_id', authenticateToken, validateParams, validateFields, postDesktop)
router.patch('/patch/:des_id', authenticateToken, validateParams, validateFields, patchDesktop)
router.patch('/delete/:des_id', authenticateToken, validateParams, deleteDesktop)

export default router
