import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    const options = {}
    if (process.env.JWT_EXPIRE) {
        options.expiresIn = process.env.JWT_EXPIRE
    }

    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        options
    )
}

export default generateToken
