const express = require('express');
const axios = require('axios');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getAirtableToken } = require('../services/airtable');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');

// Generate a random state for security
const state = crypto.randomBytes(16).toString('hex');
// PKCE code verifier (simplified for now, ideally should be dynamic per request)
const codeVerifier = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Must be > 43 chars 
const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

// @route   GET /auth/airtable
// @desc    Initiate Airtable OAuth
// @access  Public
router.get('/airtable', (req, res) => {
  const scopes = ['data.records:read', 'data.records:write', 'schema.bases:read', 'user.email:read'];
  const redirectUri = process.env.AIRTABLE_REDIRECT_URI;
  const clientId = process.env.AIRTABLE_CLIENT_ID;

  const url = `https://airtable.com/oauth2/v1/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes.join(' ')}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  res.json({ url });
});

// @route   GET /auth/airtable/callback
// @desc    Handle OAuth callback
// @access  Public
router.get('/airtable/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({ message: 'Airtable authentication failed' });
  }

  try {
    const tokenData = await getAirtableToken(code);
    
    // In a real app, you'd fetch user info from Airtable here using the token
    // For now, we'll assume we get some ID or use the token to fetch "whoami"
    // Airtable API doesn't have a simple "me" endpoint for OAuth identity yet, 
    // so we might need to rely on the token response or fetch a base list to get a user ID if available.
    // Actually, Airtable OAuth token response usually includes `refresh_token` and `access_token`.
    // We need a unique identifier. 
    // Let's fetch the user's ID using https://api.airtable.com/v0/meta/whoami
    
    const userResponse = await axios.get('https://api.airtable.com/v0/meta/whoami', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    
    const airtableUserId = userResponse.data.id;
    const email = userResponse.data.email;

    let user = await User.findOne({ airtableUserId });

    if (user) {
      user.accessToken = tokenData.access_token;
      user.refreshToken = tokenData.refresh_token;
      user.tokenExpiry = new Date(Date.now() + tokenData.expires_in * 1000);
      await user.save();
    } else {
      user = await User.create({
        airtableUserId,
        email,
        name: email.split('@')[0], // Fallback name
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000)
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}`);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
});

// @route   GET /auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  const user = req.user.toObject();
  delete user.accessToken;
  delete user.refreshToken;
  res.json(user);
});

module.exports = router;
