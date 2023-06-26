import express from 'express'
import { getProject, getAllProjects, postProject } from '../controllers/projects.js'

const router = express.Router()

router.get('/:des_id', getAllProjects)
router.get('/:pro_id/:des_id', getProject)
router.post('/post/:uda_id/:des_id', postProject)
//router.patch('/patch/:des_id', patchDesktop)

export default router