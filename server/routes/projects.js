import express from 'express'
import { getProjects, postProject, deleteProject, patchProject } from '../controllers/projects.js'

const router = express.Router()

router.get('/:des_id/:pro_id', getProjects)
router.post('/:des_id/:uda_id', postProject)
router.patch('/patch/:des_id/:pro_id', patchProject)
router.patch('/delete/:des_id/:pro_id', deleteProject)

export default router