const BoardPl = require("../model/BoardPl");
const { getBoard, getNextMoveFor, getAvailableUserMoves} = require("../prolog/prolog-predicates");
const boardPlInstance = new BoardPl();
let maxDepth = 1;
class CheckersController {
    async setDifficulty(req, res, next) {
        try {
            const difficulty  = req.query.difficulty; // Check if difficulty is correctly received from the request body
            maxDepth = difficulty;
            res.status(200).json({ message: 'Difficulty set successfully', boardState: boardPlInstance.getBoardState() });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to set difficulty" });
        }
    }

    async getInitialBoard(req, res, next) {
        try {
            getBoard((error, boardString) => {
                if (error) {
                    return res.status(500).json({ error: "Failed to get board from Prolog" });
                }
                // Initialize boardPlInstance with the obtained board string
                boardPlInstance.initializeBoard(boardString.links.Board);
                console.log(boardPlInstance);
                console.log(boardPlInstance.getBoardState());
                // Send response indicating successful initialization
                res.status(200).json({ message: 'Board initialized successfully', boardState: boardPlInstance.getBoardState() });
            });
        } catch (error) {
            next(error);
        }

    }

    async getUserMoves(req, res, next){
        try {
            const color = req.query.color;
            getAvailableUserMoves(color, boardPlInstance.getBoardState(), (error, moves) => {
                if (error) {
                    return res.status(500).json({ error: "Failed to get user moves from Prolog" });
                }
                const movesObject = moves.links.Moves;
                const movesData = movesObject.args.map(move => {
                    // Extracting move data
                    const X1 = move.args[0].value;
                    const Y1 = move.args[1].value;
                    const X2 = move.args[2].value;
                    const Y2 = move.args[3].value;

                    // Return an object representing a move
                    return {
                        X1: X1,
                        Y1: Y1,
                        X2: X2,
                        Y2: Y2,
                    };
                });
                console.log(moves);
                res.status(200).json({ message: 'Board initialized successfully', movesCoordinates: movesData });
            });
        } catch (error) {
            next(error);
        }
    }
   async updateUserMove(req, res, next) {
       const { X1, Y1, X2, Y2, eatenCheckers } = req.body;

       try {
            boardPlInstance.updateBoardWithCoords(Y1, X1, Y2, X2);
            boardPlInstance.eatCheckers(eatenCheckers);
           for (let i = 0; i < eatenCheckers.length; i++) {
               const { x, y } = eatenCheckers[i];
               console.log(`Eaten checker ${i + 1}: x = ${x}, y = ${y}`);
           }
            console.log(boardPlInstance);
            console.log(boardPlInstance.getBoardState());
            res.status(200).json({ message: 'Board updated successfully', boardState: boardPlInstance.getBoardState() });
        } catch (error) {
            // Handle any errors that occur during the board update
            console.error(error);
            res.status(500).json({ error: "Failed to update board" });
        }
    }

    async updateCompMove(req, res, next) {
        try {
            // Get the current board state from the boardPlInstance
            const boardState = boardPlInstance.getBoardState();
            const { color } = req.body;

            // Calculate the next move for the computer player
            getNextMoveFor(color, boardState, maxDepth, (error, coordinates) => {
                if (error) {
                    console.error('Error calculating next move:', error);
                    return res.status(500).json({ error: 'Failed to calculate next move' });
                }

               let term = coordinates.links.NextMove;
                const X1 = term.args[0].value;
                const Y1 = term.args[1].value;
                const X2 = term.args[2].value;
                const Y2 = term.args[3].value;
                const boardTemp = term.args[4];
                boardPlInstance.initializeBoard(boardTemp);// Send response with updated board state
                console.log(boardPlInstance);
                console.log(boardPlInstance.getBoardState());
                res.status(200).json({
                    message: 'Computer move calculated and board updated',
                    boardState: boardPlInstance.boardState,
                    moveCoordinates: { X1, Y1, X2, Y2 } // Include the move coordinates in the response
                });
            });
        } catch (error) {
            // Handle any errors that occur during the move calculation
            console.error('Error calculating computer move:', error);
            res.status(500).json({ error: 'Failed to calculate computer move' });
        }
    }
}

module.exports = CheckersController;