const swipl = require("swipl")

//swipl.call('consult(["checkers.pl"])');
const playerColor = 'white'; // or 'black'
const boardState = 'game_board(l(0, b, 0, b, 0, b, 0, b),l(b, 0, b, 0, b, 0, b, 0),l(0, b, 0, b, 0, b, 0, b),l(1, 0, 1, 0, 1, 0, 1, 0),l(0, 1, 0, 1, 0, 1, 0, 1),l(w, 0, w, 0, w, 0, w, 0),l(0, w, 0, w, 0, w, 0, w),l(w, 0, w, 0, w, 0, w, 0))';

let rez = swipl.call(`getNextMoveFor( ${playerColor},${boardState},5, Moves).`).Moves;
console.log(rez);