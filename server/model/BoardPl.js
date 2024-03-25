
class BoardPl {
    constructor() {
        this.boardState = null;
        this.boardPl=null;
    }
    initializeBoard(boardTerm) {
        this.boardPl = boardTerm;
        const rows = boardTerm.args.map(rowTerm => {
            return rowTerm.args.map(cellTerm => {
                if (cellTerm.is_float || typeof cellTerm.value === 'number') {
                    return cellTerm.value;
                } else if (cellTerm.id === 'b') {
                    return 'b'; // Assuming 'b' represents black pieces
                } else if (cellTerm.id === 'w') {
                    return 'w'; // Assuming 'w' represents white pieces
                }else if (cellTerm.id === 'wq') {
                    return 'wq'; // Assuming 'w' represents white pieces
                }else if (cellTerm.id === 'bq') {
                    return 'bq'; // Assuming 'w' represents white pieces
                } else {
                    return null; // Handle other cases as needed
                }
            });
        });
        this.boardState = rows;
    }


    updateBoard(newState) {
        this.boardState = newState;
    }

    updateBoardWithCoords(X1, Y1, X2, Y2, isKing) {
        let temp = this.boardState[X1][Y1]; // Initialize temp with the piece at position X1, Y1
        this.boardState[X1][Y1] = this.boardState[X2][Y2]; // Move the piece from X2, Y2 to X1, Y1
        if (isKing) {
            // Check if the piece should be promoted to a king
            if (temp === "b") {
                temp = "bq"; // Promote black piece to king
            } else if (temp === "w") {
                temp = "wq"; // Promote white piece to king
            }
        }
        this.boardState[X2][Y2] = temp; // Update the piece at X2, Y2 with temp
    }

    eatCheckers(eatenCheckers){
        for (let i = 0; i < eatenCheckers.length; i++) {
            const { x, y } = eatenCheckers[i];
            this.boardState[x][y] = 1;
        }
    }

    getBoardState() {
        // Return the current state of the board
        const rows = this.boardState.map(row => "l(" + row.join(", ") + ")");
        return "game_board("+rows.join(",")+")";
    }
}

module.exports = BoardPl;
