import express from 'express'
import { deleteMember, getMember, patchMember, postMember } from '../controllers/members.js'

const router = express.Router()

router.get('/:uda_id', getMember)
router.post('/:des_id/:use_id', postMember)
router.patch('/patch/:des_id/:uda_id', patchMember)
router.patch('/delete/:des_id/:fra_id', deleteMember)

export default router