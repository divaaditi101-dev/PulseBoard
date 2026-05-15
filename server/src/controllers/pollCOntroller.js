import Poll from '../models/Poll.js'

// @POST /api/polls
export const createPoll = async (req, res) => {
    try {
        const { title, description, questions, isAnonymous, expiresAt } = req.body

        if (!questions || questions.length === 0) {
            return res.status(400).json({ message: 'At least one question is required' })
        }

        const poll = await Poll.create({
            title,
            description,
            questions,
            isAnonymous,
            expiresAt,
            creator: req.user._id
        })

        res.status(201).json(poll)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @GET /api/polls/my
export const getMyPolls = async (req, res) => {
    try {
        const polls = await Poll.find({ creator: req.user._id })
            .sort({ createdAt: -1 })

        res.json(polls)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @GET /api/polls/:token
export const getPollByToken = async (req, res) => {
    try {
        const poll = await Poll.findOne({ shareToken: req.params.token })
            .populate('creator', 'name')

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' })
        }

        // Check if poll is expired
        if (new Date() > new Date(poll.expiresAt)) {
            poll.isActive = false
            await poll.save()
        }

        res.json(poll)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @PUT /api/polls/:id/publish
export const publishPoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id)

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' })
        }

        // Only creator can publish
        if (poll.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        poll.isPublished = true
        poll.isActive = false
        await poll.save()

        res.json({ message: 'Poll published successfully', poll })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @DELETE /api/polls/:id
export const deletePoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id)

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' })
        }

        if (poll.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        await poll.deleteOne()
        res.json({ message: 'Poll deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}