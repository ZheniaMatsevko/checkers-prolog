// prolog-predicates.js

const swipl = require("swipl")
swipl.call(`consult(["checkers.pl"])`);

exports.getBoard = () => {
    return swipl.call(`board_initialize_game(Board).`).Board;
};

exports.getNextMoveFor = (playerColor, boardState, depth) => {
    return swipl.call(`getNextMoveFor(${playerColor}, ${boardState}, ${depth}, NextMove).`).NextMove;
};

