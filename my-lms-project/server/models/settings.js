const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  heroTitle: { type: String, default: 'Education GrowCourse Theme' },
  heroSubtitle: { type: String, default: 'The all-in-one solution for your online education website.' }
});

module.exports = mongoose.model('Settings', settingsSchema);