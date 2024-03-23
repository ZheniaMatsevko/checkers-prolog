import React, { useState } from 'react';
import { ColorsEnum } from "../enums/ColorsEnum";

interface ColorSelectionModalProps {
    onSelectColor: (color: ColorsEnum) => void;
}

const ColorSelectionModal: React.FC<ColorSelectionModalProps> = ({ onSelectColor }: ColorSelectionModalProps) => {
    const [selectedColor, setSelectedColor] = useState<ColorsEnum | null>(null);

    const handleColorSelection = (color: ColorsEnum) => {
        setSelectedColor(color);
        onSelectColor(color); // Call onSelectColor immediately after selecting a color
    };

    return (
        <div className="modal">
            <div className="modal__inner">
                <h3>Choose Checker Color</h3>
                <div>
                    <button className="btn" type="button" onClick={() => handleColorSelection(ColorsEnum.BLACK)}>Black</button>
                    <button className="btn" type="button" onClick={() => handleColorSelection(ColorsEnum.WHITE)}>White</button>
                </div>
            </div>
        </div>
    );
};

export default ColorSelectionModal;
