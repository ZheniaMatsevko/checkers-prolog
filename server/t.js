const { getNextMoveFor } = require('./prolog/prolog-predicates');

// Example usage
const playerColor = 'white'; // or 'black'
const boardState = 'game_board(l(0, b, 0, b, 0, b, 0, b),l(b, 0, b, 0, b, 0, b, 0),l(0, b, 0, b, 0, b, 0, b),l(1, 0, 1, 0, 1, 0, 1, 0),l(0, 1, 0, 1, 0, 1, 0, 1),l(w, 0, w, 0, w, 0, w, 0),l(0, w, 0, w, 0, w, 0, w),l(w, 0, w, 0, w, 0, w, 0))';

getNextMoveFor(playerColor, boardState, (error, move) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Next Move:', move);
    }
});
