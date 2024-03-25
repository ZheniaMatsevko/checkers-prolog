import React, {memo, useEffect, useState} from "react";
import {BoardModel} from "../models/BoardModel";
import {CellModel} from "../models/CellModel";
import Cell from "./Cell";
import {GameModesEnum} from "../enums/GameModesEnum";
import {ColorsEnum} from "../enums/ColorsEnum";
import CheckersService from "../api/CheckersService";
import {DifficultyEnum} from "../enums/DifficultyEnum";

interface BoardProps {
    board: BoardModel;
    curPlayer: ColorsEnum,
    swapPlayer: () => Promise<void>;
    gameMode: GameModesEnum;
    difficulty: DifficultyEnum;
    updateIsGameOver: (value: boolean) => void;
}

const Board = memo(({ board, curPlayer, swapPlayer, gameMode, difficulty, updateIsGameOver }: BoardProps) => {
    const [selectedCell, setSelectedCell] = useState<CellModel | null>(null);
    const [isValidMove, setIsValidMove] = useState<boolean>(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Execute the first query and wait for it to finish
                await CheckersService.getInitialBoard();

                console.log(difficulty);
                if (gameMode === GameModesEnum.COMP_PL )
                    await CheckersService.setDifficulty(difficulty);

                // After the first query finishes successfully, execute the second query
                if (gameMode === GameModesEnum.COMP_PL && curPlayer !== board.getHumanColour()) {
                    const computerMoveData = await CheckersService.calculateComputerMove(curPlayer);
                    const newBoardState = computerMoveData.boardState;
                    board.updateBoard(newBoardState);
                    board.resetHighlights();
                    setSelectedCell(null);
                    swapPlayer();

                    //handleMove2(cell1, cell2);
                    /*const computerMoveData = await CheckersService.calculateComputerMove(curPlayer);
                    const { cell1, cell2 } = board.computerMoves(computerMoveData);
                    console.log(cell1);
                    console.log(cell2);
                    setSelectedCell(cell1);
                    console.log(selectedCell);
                    handleMove2(cell1, cell2);*/
                }
                if(gameMode === GameModesEnum.COMP_COMP){
                    while (board.hasMoves(curPlayer)) {
                        console.log("Next move by " + curPlayer);
                        const computerMoveData = await CheckersService.calculateComputerMove(curPlayer);
                        const newBoardState = computerMoveData.boardState;
                        board.updateBoard(newBoardState);
                        board.resetHighlights();
                        setSelectedCell(null);
                        swapPlayer();
                        const newPlayer = curPlayer === ColorsEnum.WHITE ? ColorsEnum.BLACK : ColorsEnum.WHITE;
                        curPlayer=newPlayer;
                    }
                    updateIsGameOver(true);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Call the inner async function to start the process
        fetchData();
    }, []);
    /*
      Select Cell / Can select cell
    */
    const selectCell = (cell: CellModel) => {
        if (cell.x === selectedCell?.x && cell.y === selectedCell?.y) {
            board.resetHighlights();
            setSelectedCell(null);
            return;
        }

        if (canSelectCell(cell)) {
            board.highlightCells(cell);
            setSelectedCell(cell);
        } else if (selectedCell !== null) {
            handleMove(cell);
        }
    }

    const canSelectCell = (cell: CellModel) => {
        if (!cell.checker || ((gameMode === GameModesEnum.COMP_COMP || gameMode === GameModesEnum.COMP_PL) && curPlayer !== board.getHumanColour())) {
            return false;
        }

        return cell.checker.player.playerColor === curPlayer;
    }

    /*
      Handle Move and change turn
    */
    const handleMove2 = (selCell: CellModel,cell: CellModel) => {
        console.log(("In handle move2"));
        console.log(selCell);
        if (selCell) {
            if (selCell.checker?.isKing) {
                board.moveKingChecker(selCell, cell.y, cell.x);
                console.log(("move king"));
            } else {
                board.moveChecker(selCell, cell.y, cell.x);
                console.log(("move checker"));
            }

            const isPlayerOneCheckerOnTheEdge = (cell.checker?.player.playerColor === ColorsEnum.WHITE && cell.y === 0);
            const isPlayerTwoCheckerOnTheEdge = (cell.checker?.player.playerColor === ColorsEnum.BLACK && cell.y === 7)

            if (!board.isKing(cell) && (isPlayerOneCheckerOnTheEdge || isPlayerTwoCheckerOnTheEdge)) {
                console.log("making King....");
                board.makeKing(cell);
            }
                board.resetHighlights();
                setSelectedCell(null);
                swapPlayer();
                /*if((gameMode===GameModesEnum.PL_PL || gameMode===GameModesEnum.COMP_PL) && curPlayer===board.getHumanColour()){
                    CheckersService.getAvailableUserMoves(curPlayer)
                        .then(data=>board.setPossibleMoves(data))
                        .catch(error => console.error('Помилка при отриманні можливих ходів', error));
                }*/

        }
    }
    const handleMove = async (cell: CellModel) => {
        console.log(("In handle move"));
        console.log(selectedCell);
        if (selectedCell) {
            if (!board.canMoveChecker(curPlayer, selectedCell, cell.y, cell.x)) {
                setIsValidMove(false);
                setTimeout(() => setIsValidMove(true), 1000);
                console.log("Check for valid move failed");
                return;
            }

            let isJump = board.isJumpMove(selectedCell, cell.y);
            if (selectedCell.checker?.isKing) {
                board.moveKingChecker(selectedCell, cell.y, cell.x);
                console.log(("move king"));
            } else {
                board.moveChecker(selectedCell, cell.y, cell.x);
                console.log(("move checker"));
            }
            if(!isJump){
                console.log("sending data to backend");

                const moveData = {
                    X1: selectedCell.x,
                    Y1: selectedCell.y,
                    X2: cell.x,
                    Y2: cell.y,
                    eatenCheckers: [] // Assuming eatenCheckers is empty in this case
                };

                await CheckersService.sendUserMove(moveData);
            }else{
                console.log("sending data to backend");

                let midY = (selectedCell.y + cell.y) / 2;
                let midX = (selectedCell.x + cell.x) / 2;
                const moveData2 = {
                    X1: selectedCell.x,
                    Y1: selectedCell.y,
                    X2: cell.x,
                    Y2: cell.y,
                    eatenCheckers: [{ x: midY, y: midX }]
                };

                await CheckersService.sendUserMove(moveData2);
            }

            const isPlayerOneCheckerOnTheEdge = (cell.checker?.player.playerColor === ColorsEnum.WHITE && cell.y === 0);
            const isPlayerTwoCheckerOnTheEdge = (cell.checker?.player.playerColor === ColorsEnum.BLACK && cell.y === 7)

            if (!board.isKing(cell) && (isPlayerOneCheckerOnTheEdge || isPlayerTwoCheckerOnTheEdge)) {
                console.log("making King....");
                board.makeKing(cell);
            }

            if (isJump && board.canKeepJumping(cell)) {
                board.highlightCells(cell);
                setSelectedCell(cell);
            } else {
                board.resetHighlights();
                setSelectedCell(null);
                console.log("User made move successfully" + " Current player" + curPlayer);
                await swapPlayer();
                console.log("User made move successfully" + " Current player" + curPlayer);
                if ((gameMode === GameModesEnum.COMP_COMP || gameMode === GameModesEnum.COMP_PL)) {
                    console.log("Now computer makes move");
                    const computerMoveData = await CheckersService.calculateComputerMove(curPlayer === ColorsEnum.BLACK ? ColorsEnum.WHITE : ColorsEnum.BLACK);
                    const newBoardState = computerMoveData.boardState;
                    board.updateBoard(newBoardState);
                    board.resetHighlights();
                    setSelectedCell(null);
                    swapPlayer();
                }
            }
        }
    }

    return (
        <div className="board">
            {board.cells.map((row, index) => (
                <React.Fragment key={index}>
                    {row.map((cell, index) => (
                        <Cell
                            key={index}
                            cell={cell}
                            isSelected={selectedCell?.x === cell.x && selectedCell.y === cell.y}
                            onClick={selectCell}
                        />
                    ))}
                </React.Fragment>
            ))}

            {!isValidMove && (
                <div className="board__error">This isn't valid move!</div>
            )}
        </div>
    )
});

export default Board;