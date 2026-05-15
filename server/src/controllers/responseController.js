import Response from '../models/response.js'
import Poll from '../models/poll.js'

// @POST /api/responses/:token
export const submitResponse = async (req, res) => {
    try {
        const { answers } = req.body
        const poll = await Poll.findOne({ shareToken: req.params.token })

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' })
        }

        // Check if poll is active
        if (!poll.isActive) {
            return res.status(400).json({ message: 'This poll is no longer active' })
        }

        // Check if poll is expired
        if (new Date() > new Date(poll.expiresAt)) {
            poll.isActive = false
            await poll.save()
            return res.status(400).json({ message: 'This poll has expired' })
        }

        // Validate mandatory questions
        const requiredQuestions = poll.questions.filter(q => q.isRequired)
        for (const question of requiredQuestions) {
            const answered = answers.find(
                a => a.question.toString() === question._id.toString()
            )
            if (!answered) {
                return res.status(400).json({
                    message: `Question "${question.text}" is mandatory`
                })
            }
        }

        // Update option counts
        for (const answer of answers) {
            const question = poll.questions.id(answer.question)
            if (question) {
                const option = question.options.id(answer.selectedOption)
                if (option) {
                    option.count += 1
                }
            }
        }

        // Increment total responses
        poll.totalResponses += 1
        await poll.save()

        // Save response
        const response = await Response.create({
            poll: poll._id,
            respondent: poll.isAnonymous ? null : req.user?._id,
            answers,
            isAnonymous: poll.isAnonymous
        })
        
        // Emit real time update to poll room
const io = req.app.get('io')
io.to(`poll_${poll._id}`).emit('newResponse', {
    totalResponses: poll.totalResponses,
    questions: poll.questions.map(question => ({
        questionId: question._id,
        options: question.options.map(option => ({
            optionId: option._id,
            text: option.text,
            count: option.count
        }))
    }))
})

        res.status(201).json({ message: 'Response submitted successfully', response })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @GET /api/responses/:pollId/analytics
export const getAnalytics = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.pollId)

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' })
        }

        // Only creator can see analytics
        if (poll.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' })
        }

        // Build analytics
        const analytics = {
            totalResponses: poll.totalResponses,
            isActive: poll.isActive,
            isPublished: poll.isPublished,
            expiresAt: poll.expiresAt,
            questions: poll.questions.map(question => ({
                questionId: question._id,
                questionText: question.text,
                totalAnswers: question.options.reduce((sum, opt) => sum + opt.count, 0),
                options: question.options.map(option => ({
                    optionId: option._id,
                    text: option.text,
                    count: option.count,

                    percentage: question.options.reduce((sum, opt) => sum + opt.count, 0) > 0
                       ? Math.round((option.count / question.options.reduce((sum, opt) => sum + opt.count, 0)) * 100)
                        : 0
                }))
            }))
        }

        res.json(analytics)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}