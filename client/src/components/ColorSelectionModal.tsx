import React, { useState } from 'react';
import { ColorsEnum } from "../enums/ColorsEnum";
import {GameModesEnum} from "../enums/GameModesEnum";
import {DifficultyEnum} from "../enums/DifficultyEnum";

interface ColorSelectionModalProps {
    onSelectColor: (color: ColorsEnum) => void;
    onSelect: (level: DifficultyEnum) => void;
}

const ColorSelectionModal: React.FC<ColorSelectionModalProps> = ({ onSelectColor, onSelect }: ColorSelectionModalProps) => {
    const [selectedColor, setSelectedColor] = useState<ColorsEnum | null>(null);

    const handleColorSelection = (color: ColorsEnum) => {
        setSelectedColor(color);
        onSelectColor(color); // Call onSelectColor immediately after selecting a color
        onSelect(selectedMode);
    };

    const [selectedMode, setSelectedMode] = useState<DifficultyEnum>(DifficultyEnum.SIMPLE);

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMode(e.target.value as DifficultyEnum);
    };

    return (
        <div className="modal">
            <div className="modal__inner">
                <h3>Choose Difficulty Level</h3>
                <select value={selectedMode} onChange={handleModeChange}>
                    <option value={DifficultyEnum.SIMPLE}>Simple</option>
                    <option value={DifficultyEnum.MEDIUM}>Medium</option>
                    <option value={DifficultyEnum.DIFFICULT}>Difficult</option>
                </select>
                <h3>Choose Checker Color</h3>
                <div>
                    <button className="btn" type="button" onClick={() => handleColorSelection(ColorsEnum.BLACK)}>Black
                    </button>
                    <button className="btn" type="button" onClick={() => handleColorSelection(ColorsEnum.WHITE)}>White
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ColorSelectionModal;
