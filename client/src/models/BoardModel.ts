import {ColorsEnum} from "../enums/ColorsEnum";
import {TCellCoords} from "../types/TCellCoords";
import {TMoves} from "../types/TMoves";
import {CellModel} from "./CellModel";
import {CheckerModel} from "./CheckerModel";
import {getKingMoves} from "./BoardLogicSlices/getKingMoves";
import {checkAdjacent, checkJumps} from "./BoardLogicSlices/getCheckerMoves";
import {PlayerModel} from "./PlayerModel";
import {PossibleMove} from "../types/PossibleMove";
import {PlayerTypesEnum} from "../enums/PlayerTypesEnum";

export class BoardModel {
    cells: CellModel[][] = [];
    player1: PlayerModel;
    player2: PlayerModel;
    possibleMoves: PossibleMove[]

    constructor(player1: PlayerModel, player2: PlayerModel) {
        this.player1 = player1;
        this.player2 = player2;
        this.possibleMoves=[];
    }

    public setPossibleMoves(data: any){
        console.log(data);
    }

    public getHumanColour(){
        if(this.player1.playerType===PlayerTypesEnum.HUMAN)
            return this.player1.playerColor;
        if(this.player2.playerType===PlayerTypesEnum.HUMAN)
            return this.player2.playerColor;
    }
    /*
      Initialize Board and Checkers
      =============================
    */
    public initBoard() {
        for (let y = 0; y < 8; y++) {
            const row = [];
            for (let x = 0; x < 8; x++) {
                if ((y + x) % 2 !== 0) {
                    row.push(new CellModel(ColorsEnum.BLACK, x, y)); // white
                } else {
                    row.push(new CellModel(ColorsEnum.WHITE, x, y)); // black
                }
            }

            this.cells.push(row);
        }
    }

    public initCheckers() {
        let whiteY = 7
        let blackY = 0;

        // 3 iterations
        for (let i = 0; i < 3; i++) {
            // 4 iterations
            for (let x = 0; x < 8; x += 2) {
                /*
                    x = 0 2 4 6
                    x + 1 = 1 3 5 7

                    whiteY - i = 7 6 5
                    blackY + i = 0 1 2
                */
                if (i % 2 === 1) {
                    this.cells[whiteY - i][x + 1].checker = new CheckerModel(ColorsEnum.WHITE, this.player1);
                    this.cells[blackY + i][x].checker = new CheckerModel(ColorsEnum.BLACK, this.player2);
                } else {
                    this.cells[whiteY - i][x].checker = new CheckerModel(ColorsEnum.WHITE, this.player1);
                    this.cells[blackY + i][x + 1].checker = new CheckerModel(ColorsEnum.BLACK, this.player2);
                }
            }
        }
    }

    /*
      getAllMoves by player, getMoves by exact cell,
      and for this cell check it's adjacents and possible jumps
      =========================================================
    */
    public getAllMoves(colour: ColorsEnum): TMoves {
        let moves: TMoves = {
            jumps: [],
            singles: []
        };

        // Iterate through all cells, find only cells with checkers and currentPlayer
        this.cells.forEach((row) => {
            row.forEach((cell: CellModel) => {
                if (cell.checker !== null && cell.checker?.player.playerColor === colour) {
                    let checkerMoves = this.getMoves(cell);
                    moves.jumps = (moves.jumps).concat(checkerMoves.jumps);
                    moves.singles = (moves.singles).concat(checkerMoves.singles);
                }
            })
        });

        // console.log("moves: " + JSON.stringify(moves) + " " + moves.singles.length + " " + moves.jumps.length);
        return moves;
    }

    public getMoves(cell: CellModel): TMoves {
        /*
          ! To get coordinates where checker can move we use functions in folder BoardLogicSlices
        */

        let singles: TCellCoords[] = [];
        let jumps: TCellCoords[] = [];

        let upperY: number = cell.y - 1;
        let lowerY: number = cell.y + 1;
        let leftX: number = cell.x - 1;
        let rightX: number = cell.x + 1;

        // For normal checkers
        if (cell.checker && !cell.checker.isKing) {
            jumps = jumps.concat(checkJumps(
                this.cells,
                upperY,
                upperY - 1, // nextUpperY
                lowerY,
                lowerY + 1, // nextLowerY
                leftX,
                leftX - 1, // nextLeftX
                rightX,
                rightX + 1, // nextRightX
                cell.checker.player.playerColor
            ));
        }

        if (cell.checker?.player.playerColor === ColorsEnum.WHITE && !cell.checker?.isKing) {
            if (!jumps.length) {
                singles = singles.concat(checkAdjacent(this.cells, upperY, leftX, rightX));
            }
        }

        if (cell.checker?.player.playerColor === ColorsEnum.BLACK && !cell.checker?.isKing) {
            if (!jumps.length) {
                singles = singles.concat(checkAdjacent(this.cells, lowerY, leftX, rightX));
            }
        }

        // For King
        if (cell.checker?.isKing) {
            return getKingMoves(this.cells, upperY, lowerY, leftX, rightX, cell)
        }

        return { singles: singles, jumps: jumps };
    }

    /*
      Helper functions
      ===========================
    */
    public highlightCells(cell: CellModel) {
        this.resetHighlights();

        // Highlight new cells
        const allMoves = this.getAllMoves(cell.checker?.player.playerColor!);
        const moves = this.getMoves(cell);
        if ((allMoves.jumps.length > 0 && moves.jumps.length > 0) || (allMoves.jumps.length === 0 && moves.jumps.length === 0)) {
            const mixedMoves = [...moves.jumps, ...moves.singles];
            mixedMoves?.forEach(move => {
                this.cells[move.y][move.x].available = true;
            });
        }
    }

    public resetHighlights() {
        this.cells.forEach(row => {
            row.forEach(cell => {
                cell.available = false;
            })
        })
    }

    public canMoveChecker(colour: ColorsEnum, selectedCell: CellModel, cellY: number, cellX: number): boolean {
        let allMoves = this.getAllMoves(colour);
        let moves = this.getMoves(selectedCell);
        let movesToCheck = moves.jumps.length ? moves.jumps : moves.singles;

        /*
          If we have jumps, then we check jumps for this exact checker, and if this checker
          doesn't have jumps, then we return false
        */
        if (allMoves.jumps.length > 0 && moves.jumps.length <= 0) {
            return false;
        }

        for (let move of movesToCheck) {
            const cMove: TCellCoords = move;
            // if we have move with coordinates like in cellY and cellX, then we can move
            if (cMove.y === cellY && cMove.x === cellX) {
                return true;
            }
        }

        return false;
    }

    public hasMoves(colour: ColorsEnum): boolean {
        let moves = this.getAllMoves(colour);
        return moves.jumps.length + moves.singles.length > 0;
    }

    public isJumpMove(cell: CellModel, y: number): boolean {
        return this.getMoves(cell).jumps.length > 0;
    }

    public canKeepJumping(cell: CellModel): boolean {
        let moves = this.getMoves(cell).jumps;
        // console.log(JSON.stringify(moves));

        if (moves.length) {
            return true;
        }

        return false;
    }

    /*
      King checker properties
      ==================================
    */
    public makeKing(cell: CellModel) {
        cell.checker!.isKing = true;
    }

    public isKing(cell: CellModel) {
        return cell.checker?.isKing;
    }

    /*
      Move checkers
      ==================================
    */
    public moveChecker(selectedCell: CellModel, cellY: number, cellX: number) {
        let cY = selectedCell.y;
        let cX = selectedCell.x;

        if (this.isJumpMove(selectedCell, cellY)) {
            let midY = (cY + cellY) / 2;
            let midX = (cX + cellX) / 2;
            this.cells[midY][midX].checker = null;
            console.log("isJumpMove(selectedCell, cellY)");
        }

        this.cells[cellY][cellX].checker = selectedCell.checker;
        console.log("put "+selectedCell.checker+"on "+cellY+", " + cellX);
        this.cells[cY][cX].checker = null;
        console.log("moved Checker");
    }

    public moveKingChecker(selectedCell: CellModel, cellY: number, cellX: number) {
        const absY = Math.abs(cellY - selectedCell.y);
        const dy = selectedCell.y < cellY ? 1 : -1; // 1
        const dx = selectedCell.x < cellX ? 1 : -1; // - 1

        let eatenX = -1;
        let eatenY = -1;
        for (let i = 1; i < absY; i++) {
            // If cell doesn't have checker, skip
            if (this.cells[selectedCell.y + dy * i][selectedCell.x + dx * i].checker === null) {
                continue;
            }

            // If cell have some checker, then we remove it
            this.cells[selectedCell.y + dy * i][selectedCell.x + dx * i].checker = null;
            eatenX = selectedCell.x + dx * i;
            eatenY = selectedCell.y + dy * i;
            break;
        }

        this.cells[cellY][cellX].checker = selectedCell.checker;
        this.cells[selectedCell.y][selectedCell.x].checker = null;
        return {eatenX, eatenY};
    }
    updateBoard(data: any){
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            for (let j = 0; j < row.length; j++) {
                const element = row[j];
                console.log(this.cells[i][j]);
                switch (element) {
                    case 0:
                        this.cells[i][j].checker = null;
                        console.log("Empty cell");
                        break;
                    case 1:
                        this.cells[i][j].checker = null;
                        console.log("Value is 1");
                        break;
                    case "b":
                        this.cells[i][j].checker = new CheckerModel(ColorsEnum.BLACK, this.player2);
                        console.log("Black checker");
                        break;
                    case "w":
                        this.cells[i][j].checker = new CheckerModel(ColorsEnum.WHITE, this.player1);
                        console.log("White checker");
                        break;
                    case "bq":
                        this.cells[i][j].checker = new CheckerModel(ColorsEnum.BLACK, this.player2);
                        this.makeKing(this.cells[i][j]);
                        console.log("Black checker");
                        break;
                    case "wq":
                        this.cells[i][j].checker = new CheckerModel(ColorsEnum.WHITE, this.player1);
                        this.makeKing(this.cells[i][j]);
                        break;
                    default:
                        // Handle unexpected value
                        console.log("Unknown value:", element);
                }
                console.log(`Element at position (${i}, ${j}): ${element}`);
            }
        }

        console.log(this.cells);
    }
    computerMoves(data: any) {
        console.log(data);
        const moveCoordinates = data.moveCoordinates;
        // Now you can access moveCoordinates.X1, moveCoordinates.Y1, moveCoordinates.X2, moveCoordinates.Y2
        const { X1, Y1, X2, Y2 } = moveCoordinates;
        const X1ToMove = Y1-1;
        const Y1ToMove=X1-1;
        const X2ToMove = Y2-1;
        const Y2ToMove=X2-1;

        const cell1 = this.cells[X1ToMove][Y1ToMove];
        const cell2 = this.cells[X2ToMove][Y2ToMove];
        console.log(`Move from (${X1ToMove}, ${Y1ToMove}) to (${X2ToMove}, ${Y2ToMove})`);
        return { cell1, cell2 };

    }

}