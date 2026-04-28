const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

router.get('/stats', auth, adminOnly, adminController.getStats);
router.get('/users', auth, adminOnly, adminController.getUsers);
router.delete('/users/:id', auth, adminOnly, adminController.deleteUser);

module.exports = router;