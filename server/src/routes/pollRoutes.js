import express from 'express'
import {
    createPoll,
    getMyPolls,
    getPollByToken,
    publishPoll,
    deletePoll
} from '../controllers/pollController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, createPoll)
router.get('/my', protect, getMyPolls)
router.get('/:token', getPollByToken)
router.put('/:id/publish', protect, publishPoll)
router.delete('/:id', protect, deletePoll)

export default router