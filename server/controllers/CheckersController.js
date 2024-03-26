const BoardPl = require("../model/BoardPl");
const { getBoard, getNextMoveFor, getAvailableUserMoves} = require("../prolog/prolog-predicates");
const boardPlInstance = new BoardPl();
let maxDepth = 30;
class CheckersController {
    async setDifficulty(req, res, next) {
        try {
            const difficulty  = req.query.difficulty;
            maxDepth = difficulty;
            res.status(200).json({ message: 'Difficulty set successfully', boardState: boardPlInstance.getBoardState() });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to set difficulty" });
        }
    }

    async getInitialBoard(req, res, next) {
        try {
            const boardString = getBoard();
            boardPlInstance.initializeBoard(boardString);
            res.status(200).json({ message: 'Board initialized successfully', boardState: boardPlInstance.getBoardState() });

        } catch (error) {
            next(error);
        }

    }
   async updateUserMove(req, res, next) {
       const { X1, Y1, X2, Y2, eatenCheckers, isKing } = req.body;

       try {
            boardPlInstance.updateBoardWithCoords(Y1, X1, Y2, X2, isKing);
            boardPlInstance.eatCheckers(eatenCheckers);

            res.status(200).json({ message: 'Board updated successfully', boardState: boardPlInstance.getBoardState() });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to update board" });
        }
    }

    async updateCompMove(req, res, next) {
        try {
            // Get the current board state from the boardPlInstance
            const boardState = boardPlInstance.getBoardState();
            const { color } = req.body;
            const nextMove = getNextMoveFor(color, boardState, maxDepth);

                const boardTemp = nextMove.args[4];
                boardPlInstance.initializeBoard(boardTemp);// Send response with updated board state
                res.status(200).json({
                    message: 'Computer move calculated and board updated',
                    boardState: boardPlInstance.boardState,
                });
        } catch (error) {
            // Handle any errors that occur during the move calculation
            console.error('Error calculating computer move:', error);
            res.status(500).json({ error: 'Failed to calculate computer move' });
        }
    }
}

module.exports = CheckersController;