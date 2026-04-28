const express = require('express');
const router = express.Router();
const Settings = require('../models/settings');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

// Get Settings (Public)
router.get('/home', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

// Update Settings (Admin Only)
router.put('/home', auth, adminOnly, async (req, res) => {
  try {
    let settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(settings);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;