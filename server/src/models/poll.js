import e from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    count: {
        type: Number,
        default: 0

    }

})

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    options: [optionSchema],
    isRequired: {
        type: Boolean,
        default: true
    }
})
const pollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Poll title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true  

    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [questionSchema],
    isAnonymous: {
        type: Boolean,
        default: false

    },
    expiresAt: {    
        type: Date,
        required: [true, 'Expiration date is required']
    },
    isPublished: {
        type: Boolean,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    shareToken: {
        type: String,
        unique: true,
        default: function() {
            return uuidv4();
        }
    },
    totalResponses: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true    
})
export default mongoose.model('Poll',pollSchema)