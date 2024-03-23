import {ColorsEnum} from "../enums/ColorsEnum";

interface WinnerModalProps {
    isHidden: boolean,
    curPlayer: ColorsEnum,
    onClick: () => void;
}

const WinnerModal = ({ isHidden, curPlayer, onClick }: WinnerModalProps) => {
    if (isHidden) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal__inner">
                <h3>{curPlayer} wins!</h3>
                <button className="btn" type="button" onClick={onClick}>Restart Game</button>
            </div>
        </div>
    )
}

export default WinnerModal;