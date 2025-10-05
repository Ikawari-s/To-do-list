const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const taskRoutes = require('./routes/TaskRouter');
const userRoutes = require('./routes/UserRouter');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Todo List API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      tasks: '/api/tasks',
      taskStats: '/api/tasks/stats',
      userRegister: '/api/users/register',
      userLogin: '/api/users/login',
      userProfile: '/api/users/profile (protected)',
      userLogout: '/api/users/logout (protected)'
    }
  });
});

// Mount task routes
app.use('/api/tasks', taskRoutes);

// Mount user routes
app.use('/api/users', userRoutes);

// Server info endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Todo List API Server',
    version: '1.0.0',
    status: 'Running',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      api: '/api',
      health: '/api/health',
      tasks: '/api/tasks',
      users: '/api/users'
    }
  });
});

// Handle 404 for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server running on http://localhost:${PORT}`);
  }
});

// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
  server.close(async () => {
    try {
      await prisma.$disconnect();
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;