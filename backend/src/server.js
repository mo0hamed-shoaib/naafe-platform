import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

// Import configurations
import { connectDB } from './config/database.js'

// Import routes
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import serviceRequestRoutes from './routes/serviceRequests.js'
import offerRoutes from './routes/offers.js'
import paymentRoutes from './routes/payments.js'
import uploadRoutes from './routes/upload.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
})

// Connect to MongoDB
connectDB()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'تم تجاوز الحد الأقصى للطلبات، يرجى المحاولة لاحقاً',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API routes
const apiVersion = process.env.API_VERSION || 'v1'
const apiPrefix = `/api/${apiVersion}`

app.use(`${apiPrefix}/auth`, authRoutes)
app.use(`${apiPrefix}/users`, userRoutes)
app.use(`${apiPrefix}/service-requests`, serviceRequestRoutes)
app.use(`${apiPrefix}/offers`, offerRoutes)
app.use(`${apiPrefix}/payments`, paymentRoutes)
app.use(`${apiPrefix}/upload`, uploadRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'مرحباً بك في API منصة Naafe',
    version: apiVersion,
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
    health: `${req.protocol}://${req.get('host')}/health`
  })
})

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id)
  
  // Join user to their personal room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`)
    console.log(`👤 User ${userId} joined their room`)
  })
  
  // Join provider to their room
  socket.on('join-provider', (providerId) => {
    socket.join(`provider-${providerId}`)
    console.log(`🔧 Provider ${providerId} joined their room`)
  })
  
  // Handle chat messages
  socket.on('send-message', (data) => {
    const { recipientId, message, senderId } = data
    socket.to(`user-${recipientId}`).emit('new-message', {
      senderId,
      message,
      timestamp: new Date()
    })
  })
  
  // Handle offer notifications
  socket.on('offer-created', (data) => {
    const { seekerId, offerData } = data
    socket.to(`user-${seekerId}`).emit('new-offer', offerData)
  })
  
  // Handle request notifications
  socket.on('request-created', (data) => {
    const { category, location } = data
    // Notify relevant providers
    socket.to(`category-${category}`).emit('new-request', data)
  })
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id)
  })
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Make io available to routes
app.set('io', io)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('✅ Process terminated')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('✅ Process terminated')
    process.exit(0)
  })
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', err)
  server.close(() => {
    process.exit(1)
  })
})

export default app
