// prolog-predicates.js

const pl = require("tau-prolog");
const fs = require("fs");
const path = require("path");
const util = require("util");

exports.getBoard = (callback) => {
    const pQuery = 'board_initialize_game(Board).';
    getResponseFromProlog(pQuery, callback);
};

exports.getNextMoveFor = (playerColor, boardState, callback) => {
    const pQuery = `getNextMoveFor(${playerColor}, ${boardState}, Coordinates).`;
    getResponseFromProlog(pQuery, callback);
};
function getResponseFromProlog(pQuery, callback) {
    const session = pl.create();
    let responseSent = false;

    fs.readFile(path.join(__dirname, "checkers.pl"), 'utf8', function (error, data) {
        if (error) {
            console.log(error);
            return callback(error);
        }

        session.consult(util.format(data), {
            success: function () {
                session.query(pQuery, {
                    success: function () {
                        session.answers(x => {
                            if (!responseSent) {
                                responseSent = true;
                                callback(null, x);
                            }
                        });
                    }
                });
            },
            error: function (err) {
                session.answers(() => {
                    console.error("Error consulting Prolog:", err);
                    if (!responseSent) {
                        responseSent = true;
                        callback(err);
                    }
                });
            }
        });
    });
}
