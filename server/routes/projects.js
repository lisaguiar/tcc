import express from 'express'
import { getProject, getAllProjects, postProject, deleteProject, patchProject } from '../controllers/projects.js'

const router = express.Router()

router.get('/all/:des_id/:pro_id', getAllProjects)
router.get('/one/:pro_id/:des_id', getProject)
router.post('/post/:uda_id/:des_id', postProject)
router.patch('/patch/:pro_id', patchProject)
router.patch('/delete/:pro_id', deleteProject)

export default router