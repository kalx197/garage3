const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // Protect all tool actions
router.get('/', toolController.getTools);
router.post('/', toolController.addTool);
router.post('/allocation', toolController.toggleAllocation);

module.exports = router;
