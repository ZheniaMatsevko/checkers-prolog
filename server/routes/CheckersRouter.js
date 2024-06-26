const express = require('express');
const router = express.Router();
const CheckersControllers = require('../controllers/CheckersController');

const checkersController = new CheckersControllers();

// Create a new task
router.get('/get-initial-board', checkersController.getInitialBoard);


router.put('/user-move', checkersController.updateUserMove);

router.put('/comp-move', checkersController.updateCompMove);

router.post('/set-difficulty', checkersController.setDifficulty)

module.exports = router;
