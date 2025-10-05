const express = require('express')
const jwt = require('jsonwebtoken')
const userController = require('../controllers/UserController')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      })
    }
    
    req.user = user
    next()
  })
}

// Public routes (no authentication required)
router.post('/register', userController.register)
router.post('/login', userController.login)

// Protected routes (authentication required)
router.get('/profile', authenticateToken, userController.getProfile)
router.put('/profile', authenticateToken, userController.updateProfile)
router.post('/logout', authenticateToken, userController.logout)

// Test route to verify authentication
router.get('/test', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication working',
    user: req.user
  })
})

module.exports = router