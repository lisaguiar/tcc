import express from 'express'
import { 
    deleteProject, 
    getAllProjects,
    getProjects, 
    getProject,
    patchProject,
    postProject 
} from '../controllers/projectController.js'
import authenticateToken from '../middleware/auth.js'
import validateParams from '../middleware/params.js'
import validateFields from '../middleware/body.js'

const router = express.Router()

router.get('/', authenticateToken, getAllProjects)
router.get('/:des_id', authenticateToken, validateParams, getProjects)
router.get('/one/:pro_id', authenticateToken, validateParams, getProject)
router.post('/:des_id/:uda_id', authenticateToken, validateParams, validateFields, postProject)
router.patch('/patch/:des_id/:pro_id', authenticateToken, validateParams, validateFields, patchProject)
router.patch('/delete/:des_id/:pro_id', authenticateToken, validateParams, deleteProject)

export default router   