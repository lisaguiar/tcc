import express from 'express'
import { 
    deleteAnnotation, 
    getAnnotations, 
    patchAnnotation, 
    postAnnotation 
} from '../controllers/annotationController.js'
import authenticateToken from '../middleware/auth.js'
import validateParams from '../middleware/params.js'
import validateFields from '../middleware/body.js'

const router = express.Router()

router.get('/:fra_id', authenticateToken, validateParams, getAnnotations)
router.post('/:fra_id/:uda_id', authenticateToken, validateParams, validateFields, postAnnotation)
router.patch('/patch/:fra_id/:ann_id', authenticateToken, validateParams, validateFields, patchAnnotation)
router.patch('/delete/:fra_id/:ann_id', authenticateToken, validateParams, deleteAnnotation)

export default router