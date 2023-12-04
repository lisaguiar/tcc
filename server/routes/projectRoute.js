import express from 'express'
import { getProjects, postProject, deleteProject, patchProject } from '../controllers/projectController.js'

const router = express.Router()

router.get('/:pro_id?', getProjects)
router.post('/:des_id/:uda_id', postProject)
router.patch('/patch/:des_id/:pro_id', patchProject)
router.patch('/delete/:des_id/:pro_id', deleteProject)

export default router   