import express from 'express'
import { submitResponse, getAnalytics } from '../controllers/responseController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// Submit response - public route (no protect)
router.post('/:token', submitResponse)

// Get analytics - protected route
router.get('/:pollId/analytics', protect, getAnalytics)

export default router