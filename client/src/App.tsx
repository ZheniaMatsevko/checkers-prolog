import {useCallback, useEffect, useState} from 'react';
import {BoardModel} from './models/BoardModel';
import Board from './components/Board';
import './App.css';
import Topbar from './components/Topbar';
import WinnerModal from './components/WinnerModal';
import GameModeModal from './components/GameModeModal';
import {GameModesEnum} from './enums/GameModesEnum';
import {ColorsEnum} from "./enums/ColorsEnum";
import {PlayerTypesEnum} from "./enums/PlayerTypesEnum";
import {PlayerModel} from "./models/PlayerModel";
import ColorSelectionModal from "./components/ColorSelectionModal";
import {DifficultyEnum} from "./enums/DifficultyEnum";


function App() {
    const [board, setBoard] = useState<BoardModel | null>(null);
    const [curPlayer, setCurPlayer] =useState<ColorsEnum>(ColorsEnum.WHITE);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);
    const [selectedMode, setSelectedMode] = useState<GameModesEnum | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyEnum>(DifficultyEnum.NONE);

    const [showColorSelectionModal, setShowColorSelectionModal] = useState<boolean>(false);
    const [selectedColor, setSelectedColor] = useState<ColorsEnum | null>(null); // State to store selected color
    const updateIsGameOver = (value: boolean) => {
        setIsGameOver(value);
    };
    /*
      Game presets
    */
    useEffect(() => {
        if (selectedMode) {
            restartGame();
            const timer = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [selectedMode]);

    const restartGame = useCallback(() => {
        if (selectedMode) {
            let player1Type: PlayerTypesEnum;
            let player2Type: PlayerTypesEnum;

            // Determine player types based on selected game mode
            switch (selectedMode) {
                case GameModesEnum.PL_PL:
                    player1Type = PlayerTypesEnum.HUMAN;
                    player2Type = PlayerTypesEnum.HUMAN;
                    break;
                case GameModesEnum.COMP_PL:
                    player1Type = PlayerTypesEnum.HUMAN;
                    player2Type = PlayerTypesEnum.COMPUTER;
                    break;
                case GameModesEnum.COMP_COMP:
                    player1Type = PlayerTypesEnum.COMPUTER;
                    player2Type = PlayerTypesEnum.COMPUTER;
                    break;
                default:
                    player1Type = PlayerTypesEnum.HUMAN;
                    player2Type = PlayerTypesEnum.HUMAN;
                    break;
            }

            console.log(selectedMode);
            console.log(selectedColor);
            let human_colour = (selectedMode === GameModesEnum.COMP_PL && selectedColor) ? selectedColor : ColorsEnum.WHITE;
            let comp_colour = (selectedMode === GameModesEnum.COMP_PL && selectedColor) ? selectedColor : ColorsEnum.BLACK;

            const player1 = new PlayerModel(player1Type, human_colour);
            const player2 = new PlayerModel(player2Type, comp_colour);
            const newBoard = new BoardModel(player1, player2);
            newBoard.initBoard();
            newBoard.initCheckers();
            setBoard(newBoard);

            setCurPlayer(ColorsEnum.WHITE);
            setIsGameOver(false);
            setTime(0);
        }
    }, [selectedMode]);


    const swapPlayer = async () => {
        return new Promise<void>((resolve) => {
            setCurPlayer(prevPlayer => {
                const newPlayer = prevPlayer === ColorsEnum.WHITE ? ColorsEnum.BLACK : ColorsEnum.WHITE;
                console.log("In swap prev=" + prevPlayer + " new=" + newPlayer);
                console.log("Rez = " + newPlayer); // Logging the newPlayer instead of curPlayer
                checkGameOver(newPlayer);
                resolve(); // Resolve the Promise once the asynchronous operations are completed
                return newPlayer; // Return the new value of the player
            });
        });
    };


    const checkGameOver = (player: ColorsEnum) => {
        if (board && !board.hasMoves(player)) {
            setIsGameOver(true);
        }
    }
    const handleModeSelect = (mode: GameModesEnum) => {
        setSelectedMode(mode);
        if (mode === GameModesEnum.COMP_PL) {
            setShowColorSelectionModal(true); // Set showColorSelectionModal to true for Computer vs Player mode
        }
    };
    const handleDifficultySelect = (mode: DifficultyEnum) => {
        setSelectedDifficulty(mode);
    };
    const handleColorSelect = (color: ColorsEnum) => {
        setSelectedColor(color);
        setShowColorSelectionModal(false);
        const player1 = new PlayerModel(PlayerTypesEnum.HUMAN, color);
        const player2 = new PlayerModel(PlayerTypesEnum.COMPUTER, color===ColorsEnum.WHITE?ColorsEnum.BLACK:ColorsEnum.WHITE);
        let newBoard = new BoardModel(player1, player2);
        if(color===ColorsEnum.BLACK){
            newBoard = new BoardModel(player2, player1);
        }
        newBoard.initBoard();
        newBoard.initCheckers();
        setBoard(newBoard);

        setCurPlayer(ColorsEnum.WHITE);
        setIsGameOver(false);
        setTime(0);
    };
    return (
        <div className="App">
            {!selectedMode && <GameModeModal onSelect={handleModeSelect} />}

            {showColorSelectionModal && ( // Render ColorSelectionModal if showColorSelectionModal is true
                <ColorSelectionModal onSelectColor={handleColorSelect} onSelect={handleDifficultySelect} />
            )}

            {selectedMode && board && !showColorSelectionModal && (

                <>
                    <Topbar
                        curPlayer={curPlayer}
                        time={time}
                    />

                    <WinnerModal
                        isHidden={!isGameOver}
                        curPlayer={curPlayer === ColorsEnum.WHITE ? ColorsEnum.BLACK : ColorsEnum.WHITE}
                        onClick={restartGame}
                    />

                    <Board
                        board={board}
                        curPlayer={curPlayer}
                        swapPlayer={swapPlayer}
                        gameMode={selectedMode}
                        updateIsGameOver={updateIsGameOver}
                        difficulty={selectedDifficulty}
                    />
                </>
            )}
        </div>
    );
}

export default App;
