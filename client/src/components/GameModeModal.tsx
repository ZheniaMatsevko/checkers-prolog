import React, { useState } from 'react';
import { GameModesEnum } from "../enums/GameModesEnum";

interface GameModeModalProps {
    onSelect: (mode: GameModesEnum) => void;
}
const GameModeModal: React.FC<GameModeModalProps> = ({ onSelect }: GameModeModalProps) => {
    const [selectedMode, setSelectedMode] = useState<GameModesEnum>(GameModesEnum.PL_PL);

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMode(e.target.value as GameModesEnum);
    };


    const handleSubmit = () => {
        onSelect(selectedMode);
    };

    return (
        <div className="modal">
            <div className="modal__inner">
            <h3>Choose Game Mode</h3>
            <select value={selectedMode} onChange={handleModeChange}>
                <option value={GameModesEnum.PL_PL}>Player vs. Player</option>
                <option value={GameModesEnum.COMP_PL}>Computer vs. Player</option>
                <option value={GameModesEnum.COMP_COMP}>Computer vs. Computer</option>
            </select>
            <button className="btn" type="button" onClick={handleSubmit}>Start Game</button>
            </div>
        </div>
    );
};

export default GameModeModal;
