import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // Create new user
        const user = await User.create({ name, email, password })

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await User.findOne({ email })

        // Check user and password
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// @GET /api/auth/me
export const getMe = async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    })
}