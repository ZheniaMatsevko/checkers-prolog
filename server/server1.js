const pl = require("tau-prolog");

const fs = require("fs");
const path = require("path");

const util = require("util");
const {query} = require("express");

const ret = (x,res) => {if (!res.headersSent) res.send(pl.format_answer(x))}

exports.getBoard = (req,res) => {
    const pQuery = 'board_initialize_game(Board).';

    getResponseFromProlog(pQuery,res);
}

const getResponseFromProlog = (pQuery, res) => {
    const session = pl.create();
    let responseSent = false;

    fs.readFile(path.join(__dirname, "checkers.pl"), 'utf8', function (error, data){
        if(error){
            console.log(error);
            process.exit(1);
        }

        session.consult(util.format(data), {
            success: function (){
                session.query(pQuery, {
                    success: function (){
                        session.answers(x => {
                            if(!responseSent){
                                responseSent=true;
                                ret(x,res);
                            }
                        });
                    }
                })
            },
            error: function (err){
                session.answers(() => {
                    if(!responseSent){
                        responseSent=true;
                        ret('My error',res);
                    }
                })
            }
        })
    })
}