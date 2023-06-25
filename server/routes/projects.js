import express from 'express'
import { getProject, getAllProjects } from '../controllers/projects.js'

const router = express.Router()

router.get('/:des_id', getAllProjects)
router.get('/:pro_id/:des_id', getProject)


//router.post('/post/:use_id', postDesktop)
//router.patch('/patch/:des_id', patchDesktop)

export default router