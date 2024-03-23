import { TCellCoords } from "../../types/TCellCoords";
import { TMoves } from "../../types/TMoves";
import { CellModel } from "../CellModel";

type TGetKingMovesFunction = (
    cells: CellModel[][],
    upperY: number,
    lowerY: number,
    leftX: number,
    rightX: number,
    cell: CellModel
) => TMoves

type TGetDiagonalMovesFunction = (
    cells: CellModel[][],
    y: number,
    x: number,
    cell: CellModel
) => TMoves

export const getKingMoves: TGetKingMovesFunction = (cells, upperY, lowerY, leftX, rightX, cell) => {
    let moves: TMoves = { jumps: [], singles: [] };
    let singles: TCellCoords[] = [];
    let jumps: TCellCoords[] = [];

    // Lower Left diagonal
    moves = getLowerLeftDiagonalMoves(cells, lowerY, leftX, cell);
    singles = singles.concat(moves.singles);
    jumps = jumps.concat(moves.jumps);

    moves = getLowerRightDiagonalMoves(cells, lowerY, rightX, cell);
    singles = singles.concat(moves.singles);
    jumps = jumps.concat(moves.jumps);

    moves = getUpperLeftDiagonalMoves(cells, upperY, leftX, cell);
    singles = singles.concat(moves.singles);
    jumps = jumps.concat(moves.jumps);
    console.log(moves);

    moves = getUpperRightDiagonalMoves(cells, upperY, rightX, cell);
    singles = singles.concat(moves.singles);
    jumps = jumps.concat(moves.jumps);
    console.log(moves);

    if (jumps.length > 0) {
        return {
            jumps,
            singles: []
        }
    } else {
        return {
            jumps: [],
            singles
        }
    }
}

/*
  Lower Left Diagonal from checker
  ================================
*/
const getLowerLeftDiagonalMoves: TGetDiagonalMovesFunction = (cells, lowerY, leftX, cell) => {
    let singles: TCellCoords[] = [];
    let jumps: TCellCoords[] = [];

    // Lower Left diagonal
    for (let y = lowerY, dx = 0; y < 8; y++) {
        // if Y and X beyond the board
        if (y >= 8 || y < 0 || leftX - dx >= 8 || leftX - dx < 0) {
            break;
        }

        // if checker's player is the same as curPlayer
        if (cells[y][leftX - dx].checker?.player === cell.checker?.player) {
            break;
        }

        if (cells[y][leftX - dx].checker === null) {
            singles.push({ y, x: leftX - dx });

            dx++;
            continue;
        }

        // If there is enemy cell
        if (cells[y][leftX - dx].checker !== null) {
            // if behind enemy is clear, then we can jump to it
            if (cells[y + 1]?.[leftX - dx - 1] && cells[y + 1][leftX - dx - 1].checker === null) {
                singles = [];
                jumps.push({ y: y + 1, x: leftX - dx - 1 });
            }

            // else there's another enemy or that's beyond the board => break
            break;
        }
    }

    return { singles, jumps }
}


/*
  Lower Right Diagonal from checker
  =================================
*/
const getLowerRightDiagonalMoves: TGetDiagonalMovesFunction = (cells, lowerY, rightX, cell) => {
    let singles: TCellCoords[] = [];
    let jumps: TCellCoords[] = [];

    // Lower Right diagonal
    for (let y = lowerY, dx = 0; y < 8; y++) {
        // if Y and X beyond the board
        if (y >= 8 || y < 0 || rightX + dx >= 8 || rightX + dx < 0) {
            break;
        }

        // if checker's player is the same as curPlayer
        if (cells[y][rightX + dx].checker?.player === cell.checker?.player) {
            break;
        }

        if (cells[y][rightX + dx].checker === null) {
            singles.push({ y, x: rightX + dx });

            dx++;
            continue;
        }

        // If there is enemy cell
        if (cells[y][rightX + dx].checker !== null) {
            // if behind enemy is clear, then we can jump to it
            if (cells[y + 1]?.[rightX + dx + 1] && cells[y + 1][rightX + dx + 1].checker === null) {
                singles = [];
                jumps.push({ y: y + 1, x: rightX + dx + 1 });
            }

            // else there's another enemy or that's beyond the board => break
            break;
        }
    }

    return { singles, jumps };
}

/*
  Upper Left Diagonal from checker
  =================================
*/
const getUpperLeftDiagonalMoves: TGetDiagonalMovesFunction = (cells, upperY, leftX, cell) => {
    let singles: TCellCoords[] = [];
    let jumps: TCellCoords[] = [];

    // Lower Left diagonal
    for (let y = upperY, dx = 0; y >= 0; y--) {
        // if Y and X beyond the board
        if (y >= 8 || y < 0 || leftX - dx >= 8 || leftX - dx < 0) {
            break;
        }

        // if checker's player is the same as curPlayer
        if (cells[y][leftX - dx].checker?.player === cell.checker?.player) {
            break;
        }

        if (cells[y][leftX - dx].checker === null) {
            singles.push({ y, x: leftX - dx });
            dx++;
            continue;
        }

        // If there is enemy cell
        if (cells[y][leftX - dx].checker !== null) {
            // if behind enemy is clear, then we can jump to it
            if (cells[y - 1]?.[leftX - dx - 1] && cells[y - 1][leftX - dx - 1].checker === null) {
                singles = [];
                jumps.push({ y: y - 1, x: leftX - dx - 1 });
            }

            // else there's another enemy or that's beyond the board => break
            break;
        }
    }

    return { singles, jumps };
}

/*
  Upper Right Diagonal from checker
  =================================
*/
const getUpperRightDiagonalMoves: TGetDiagonalMovesFunction = (cells, upperY, rightX, cell) => {
    let singles: TCellCoords[] = [];
    let jumps: TCellCoords[] = [];

    // Upper Right diagonal
    for (let y = upperY, dx = 0; y >= 0; y--) {
        // if Y and X beyond the board
        if (y >= 8 || y < 0 || rightX + dx >= 8 || rightX + dx < 0) {
            break;
        }

        // if checker's player is the same as curPlayer
        if (cells[y][rightX + dx].checker?.player === cell.checker?.player) {
            break;
        }

        if (cells[y][rightX + dx].checker === null) {
            singles.push({ y, x: rightX + dx });

            dx++;
            continue;
        }

        // If there is enemy cell
        if (cells[y][rightX + dx].checker !== null) {
            // if behind enemy is clear, then we can jump to it
            if (cells[y - 1]?.[rightX + dx + 1] && cells[y - 1][rightX + dx + 1].checker === null) {
                singles = [];
                jumps.push({ y: y - 1, x: rightX + dx + 1 });
            }

            // else there's another enemy or that's beyond the board => break
            break;
        }
    }

    return { singles, jumps };
}