const pl = require("tau-prolog");
const fs = require("fs");
const path = require("path");
const util = require("util");

// Define your Express app and routes
const express = require("express");
const app = express();
app.use(express.json());
const BoardPl = require("./model/BoardPl");

const boardPlInstance = new BoardPl();


// Your getBoard function
const getBoard = (req, res) => {
    const pQuery = 'board_initialize_game(Board).';
    getResponseFromProlog(pQuery, res);
};
const getNextMoveFor = (req, res) => {
    const { colour, board } = req.body;
    const pQuery = `getNextMoveFor(${colour}, ${board}, Coordinates).`;
    getResponseFromProlog(pQuery, res);
};
// Your getResponseFromProlog function
const getResponseFromProlog = (pQuery, res) => {
    const session = pl.create();
    let responseSent = false;

    fs.readFile(path.join(__dirname, "checkers.pl"), 'utf8', function (error, data) {
        if (error) {
            console.log(error);
            process.exit(1);
        }

        session.consult(util.format(data), {
            success: function () {
                session.query(pQuery, {
                    success: function () {
                        session.answers(x => {
                            if (!responseSent) {
                                responseSent = true;
                                ret(x, res);
                            }
                        });
                    }
                })
            },
            error: function (err) {
                session.answers(() => {
                    if (!responseSent) {
                        responseSent = true;
                        ret('My error', res);
                    }
                })
            }
        })
    })
};

// Helper function to send response
const ret = (x, res) => {
    if (!res.headersSent) {
        res.send(pl.format_answer(x));
    }
};

// Define your route
app.get('/get-board', getBoard);
app.post('/comp-move', getNextMoveFor);


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
