import express from 'express'
import { getProject, getAllProjects, postProject } from '../controllers/projects.js'

const router = express.Router()

router.get('/all/:des_id/:pro_id', getAllProjects)
router.get('/one/:pro_id/:des_id', getProject)
router.post('/post/:uda_id/:des_id', postProject)
//router.patch('/patch/:des_id', patchDesktop)

export default router