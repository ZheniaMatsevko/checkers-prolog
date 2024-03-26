
class BoardPl {
    constructor() {
        this.boardState = [];
        this.boardPl=null;
    }
    initializeBoard(boardTerm) {
        this.boardState = [];
        this.boardPl = boardTerm;

        boardTerm.args.forEach(item => {
            const row = [];
            item.args.forEach(cell => {
                row.push(cell === "b" || cell === "w" || cell === "wq" || cell === "bq" ? cell : parseInt(cell));
            });
            this.boardState.push(row);
        });
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
