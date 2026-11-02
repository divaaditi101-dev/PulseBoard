import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB, { getDbStatus } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import pollRoutes from './routes/pollRoutes.js'
import responseRoutes from './routes/responseRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env') })

connectDB()

const app = express()
const httpServer = createServer(app)

const extraOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  ...extraOrigins,
]

const corsOrigin = (origin, callback) => {
  if (!origin) return callback(null, true)
  const normalized = origin.replace(/\/$/, '')
  if (allowedOrigins.includes(normalized) || /\.vercel\.app$/.test(normalized)) {
    return callback(null, true)
  }
  return callback(new Error(`Not allowed by CORS: ${origin}`))
}

const corsOptions = {
  origin: corsOrigin,
  credentials: true,
}

const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

app.set('io', io)

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/polls', pollRoutes)
app.use('/api/responses', responseRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'PulseBoard API is running!' })
})

app.get('/api/health', (req, res) => {
  const db = getDbStatus()
  res.json({
    status: 'ok',
    database: db.state,
    dbError: db.error
  })
})

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id)

  socket.on('joinPoll', (pollId) => {
    socket.join(`poll_${pollId}`)
    console.log(`Socket ${socket.id} joined poll_${pollId}`)
  })

  socket.on('leavePoll', (pollId) => {
    socket.leave(`poll_${pollId}`)
    console.log(`Socket ${socket.id} left poll_${pollId}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id)
  })
})

const PORT = process.env.PORT || 5001

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
