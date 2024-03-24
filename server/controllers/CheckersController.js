const BoardPl = require("../model/BoardPl");
const { getBoard, getNextMoveFor} = require("../prolog/prolog-predicates");
const boardPlInstance = new BoardPl();

class CheckersController {
    async getInitialBoard(req, res, next) {
        try {
            getBoard((error, boardString) => {
                if (error) {
                    return res.status(500).json({ error: "Failed to get board from Prolog" });
                }
                // Initialize boardPlInstance with the obtained board string
                boardPlInstance.initializeBoard(boardString);
                console.log(boardPlInstance);
                console.log(boardPlInstance.getBoardState());
                // Send response indicating successful initialization
                res.status(200).json({ message: 'Board initialized successfully', boardState: boardPlInstance.getBoardState() });
            });
        } catch (error) {
            next(error);
        }

    }

   async updateUserMove(req, res, next) {
        const { X1, Y1, X2, Y2 } = req.body; // Assuming the coordinates are sent in the request body

        try {
            boardPlInstance.updateBoardWithCoords(X1, Y1, X2, Y2);
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
            getNextMoveFor(color, boardState, (error, coordinates) => {
                if (error) {
                    console.error('Error calculating next move:', error);
                    return res.status(500).json({ error: 'Failed to calculate next move' });
                }

               let term = coordinates.links.Coordinates;
                const [X1, Y1, X2, Y2] = term.args.map(arg => arg.value);
                // Send response with updated board state
                res.status(200).json({
                    message: 'Computer move calculated and board updated',
                    boardState: boardPlInstance.getBoardState(),
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