
import { TCellCoords } from "../../types/TCellCoords";
import { CellModel } from "../CellModel";
import {ColorsEnum} from "../../enums/ColorsEnum";

/*
  Check jumps
  ===========
*/

type TCheckJumpsFunction = (
    cells: CellModel[][],
    upperY: number,
    nextUpperY: number,
    lowerY: number,
    nextLowerY: number,
    left: number,
    nextLeft: number,
    right: number,
    nextRight: number,
    colour: ColorsEnum
) => TCellCoords[]

export const checkJumps: TCheckJumpsFunction = (cells, upperY, nextUpperY, lowerY, nextLowerY, leftX, nextLeftX, rightX, nextRightX, player) => {
    let jumps: TCellCoords[] = [];

    // If all the cells are beyond the board
    const isUpperYBeyond = (upperY >= 8 || upperY < 0 || nextUpperY >= 8 || nextUpperY < 0);
    const isLowerYBeyond = (lowerY >= 8 || lowerY < 0 || nextLowerY >= 8 || nextLowerY < 0);
    const isYBeyond = (isUpperYBeyond && isLowerYBeyond);
    if (isYBeyond) {
        return jumps;
    }

    /*
      If on adjacent cell there is checker,
      and beyond this checker is cell without checker,
      then we can jump
    */
    // Left Upper cell from checker
    let adjacent: CellModel | undefined = cells[upperY]?.[leftX];
    if (adjacent?.checker && adjacent.checker?.player.playerColor !== player) {
        if (cells[nextUpperY]?.[nextLeftX] && cells[nextUpperY]?.[nextLeftX].checker === null) {
            jumps.push({ y: nextUpperY, x: nextLeftX });
        }
    }

    // Right Upper cell from checker
    adjacent = cells[upperY]?.[rightX];
    if (adjacent?.checker && adjacent.checker?.player.playerColor !== player) {
        if (cells[nextUpperY]?.[nextRightX] && cells[nextUpperY]?.[nextRightX].checker === null) {
            jumps.push({ y: nextUpperY, x: nextRightX });
        }
    }

    // Left Lower cell from checker
    adjacent = cells[lowerY]?.[leftX];
    if (adjacent?.checker && adjacent.checker?.player.playerColor !== player) {
        if (cells[nextLowerY]?.[nextLeftX] && cells[nextLowerY]?.[nextLeftX].checker === null) {
            jumps.push({ y: nextLowerY, x: nextLeftX });
        }
    }

    // Right Lower cell from checker
    adjacent = cells[lowerY]?.[rightX];
    if (adjacent?.checker && adjacent.checker?.player.playerColor !== player) {
        if (cells[nextLowerY]?.[nextRightX] && cells[nextLowerY]?.[nextRightX].checker === null) {
            jumps.push({ y: nextLowerY, x: nextRightX });
        }
    }

    return jumps;
}

/*
  Check adjacents
  ===============
*/
type TCheckAdjacentFunction = (
    cells: CellModel[][],
    y: number,
    leftX: number,
    rightX: number
) => TCellCoords[]

export const checkAdjacent: TCheckAdjacentFunction = (cells, y, leftX, rightX) => {
    let moves: TCellCoords[] = [];

    // If cell is beyond the board
    if (y >= 8 || y < 0 || ((leftX >= 8 || leftX < 0) && (rightX >= 8 || rightX < 0))) {
        return moves;
    }

    /*
      If adjacent cell doesn't have checker, then we can move on it
    */
    if (cells[y][leftX] && cells[y][leftX].checker === null) {
        moves.push({ y: y, x: leftX });
    }
    if (cells[y][rightX] && cells[y][rightX].checker === null) {
        moves.push({ y: y, x: rightX });
    }

    return moves;
}