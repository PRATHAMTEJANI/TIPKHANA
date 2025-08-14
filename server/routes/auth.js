const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Verify token endpoint
router.get('/verify', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        uid: req.user.uid,
        email: req.user.email,
        name: req.user.name
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify token' 
    });
  }
});

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        uid: req.user.uid,
        email: req.user.email,
        name: req.user.name
      }
    });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve user profile' 
    });
  }
});

module.exports = router;
