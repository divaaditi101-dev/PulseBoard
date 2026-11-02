import express from 'express'
import {
    createPoll,
    getMyPolls,
    getPollByToken,
    publishPoll,
    deletePoll
} from '../controllers/pollController.js'
import { submitResponse, getAnalytics } from '../controllers/responseController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, createPoll)
router.get('/my', protect, getMyPolls)
router.get('/token/:token', getPollByToken)
router.get('/:pollId/analytics', protect, getAnalytics)
router.post('/:token/respond', submitResponse)
router.get('/:token', getPollByToken)
router.put('/:id/publish', protect, publishPoll)
router.patch('/:id/publish', protect, publishPoll)
router.delete('/:id', protect, deletePoll)

export default router
