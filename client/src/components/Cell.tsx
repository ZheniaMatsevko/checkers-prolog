import { memo } from "react";
import CheckerSVG from "../assets/CheckerSVG";
import KingCheckerSVG from "../assets/KingCheckerSVG";
import { CellModel } from "../models/CellModel";

interface CellProps {
    cell: CellModel;
    isSelected: boolean;
    onClick: (cell: CellModel) => void;
}

const Cell = memo(({ cell, isSelected, onClick }: CellProps) => {
    const classes = ["cell", cell.color];
    if (isSelected) classes.push("active");

    return (
        <div className={classes.join(" ")} onClick={() => onClick(cell)}>
            {cell.checker && (
                <div className={`checker ${cell.checker.color}`}>
                    {!cell.checker?.isKing
                        ? <CheckerSVG />
                        : <KingCheckerSVG />
                    }
                </div>
            )}
            {cell.available && (
                <div className="indicator" />
            )}
        </div>
    )
});

export default Cell;