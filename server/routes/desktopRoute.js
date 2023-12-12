import express from 'express'
import {
  deleteDesktop,
  getDesktops,
  getDesktop,
  patchDesktop,
  postDesktop,
} from '../controllers/desktopController.js'
import authenticateToken from '../middleware/auth.js'
import validateFields from '../middleware/body.js'
import validateParams from '../middleware/params.js'

const router = express.Router()

router.get('/:use_id', authenticateToken, validateParams, getDesktops)
router.get('/:use_id/:des_id', authenticateToken, validateParams, getDesktop)
router.post('/:use_id', authenticateToken, validateParams, validateFields, postDesktop)
router.patch('/patch/:des_id', authenticateToken, validateParams, validateFields, patchDesktop)
router.patch('/delete/:des_id', authenticateToken, validateParams, deleteDesktop)

export default router
