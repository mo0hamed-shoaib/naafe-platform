import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.NODE_ENV === 'production' 
  ? process.env.MONGODB_URI_PROD 
  : process.env.MONGODB_URI

// MongoDB connection options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  autoIndex: process.env.NODE_ENV !== 'production', // Build indexes in development
}

// Connect to MongoDB
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, options)
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected')
    })
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected')
    })
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close()
        console.log('✅ MongoDB connection closed through app termination')
        process.exit(0)
      } catch (err) {
        console.error('❌ Error during MongoDB shutdown:', err)
        process.exit(1)
      }
    })
    
    return conn
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

// Disconnect from MongoDB
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close()
    console.log('✅ MongoDB disconnected')
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error)
  }
}

// Get database status
export const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }
  
  return {
    state: states[mongoose.connection.readyState],
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  }
}

// Health check for database
export const healthCheck = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping()
      return { status: 'healthy', message: 'Database is connected and responsive' }
    } else {
      return { status: 'unhealthy', message: 'Database is not connected' }
    }
  } catch (error) {
    return { status: 'unhealthy', message: error.message }
  }
}
