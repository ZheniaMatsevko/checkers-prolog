const pl = require("tau-prolog");
var session = pl.create();
const playerColor = 'white'; // or 'black'
const boardState = 'game_board(l(0, b, 0, b, 0, b, 0, b),l(b, 0, b, 0, b, 0, b, 0),l(0, b, 0, b, 0, b, 0, b),l(1, 0, 1, 0, 1, 0, 1, 0),l(0, 1, 0, 1, 0, 1, 0, 1),l(w, 0, w, 0, w, 0, w, 0),l(0, w, 0, w, 0, w, 0, w),l(w, 0, w, 0, w, 0, w, 0))';

session.consult( "checkers.pl", {
    success: function () {
        console.log("Success");
        session.query( `list_available_moves( ${boardState},${playerColor}, Moves).` );

        var callback = console.log;
        session.answer(callback);
    },
    error: function (err) {
        console.log("ERROR 2: " + err);
    }
});

