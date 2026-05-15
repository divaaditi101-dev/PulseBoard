import mongoose from 'mongoose'

const answerSchema = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    selectedOption: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

const responseSchema = new mongoose.Schema({
    poll: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    respondent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    answers: [answerSchema],
    isAnonymous: {
        type: Boolean,
        default: false
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export default mongoose.model('Response', responseSchema)