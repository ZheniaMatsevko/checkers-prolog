const pl = require("tau-prolog");
require("tau-prolog/modules/lists.js")(pl);
var session = pl.create();
const show = x => console.log(session.format_answer(x));

const playerColor = 'white'; // or 'black'
const boardState = 'game_board(l(0, b, 0, b, 0, b, 0, b),l(b, 0, b, 0, b, 0, b, 0),l(0, b, 0, b, 0, b, 0, b),l(1, 0, 1, 0, 1, 0, 1, 0),l(0, 1, 0, 1, 0, 1, 0, 1),l(w, 0, w, 0, w, 0, w, 0),l(0, w, 0, w, 0, w, 0, w),l(w, 0, w, 0, w, 0, w, 0))';


session.consult("checkers.pl", {
    success: function () {
        console.log("Success");
        session.query(`getNextMoveFor(${playerColor}, ${boardState}, Coordinates).`, {
            success: function (goal) {
                session.answers(show);

            },
            error: function (err) {
            },
        });
    },
    error: function (err) {
        console.log("Error in consulting: " + err);

    },
});


/*session.consult( "checkers.pl", {
    success: function () {
        console.log("Success");
        session.query( `getNextMoveFor(${playerColor}, ${boardState}, Coordinates).` );
       // session.query( `queen(wqq).` );
        var callback = function (answer) {
            console.log(answer);
        };
        session.answer(callback);
    },
    error: function (err) {
        console.log("ERROR 2: " + err);
    }
});
*/
