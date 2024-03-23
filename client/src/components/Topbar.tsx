import {ColorsEnum} from "../enums/ColorsEnum";


interface TopbarProps {
    curPlayer: ColorsEnum;
    time: number
}

const Topbar = ({ curPlayer, time }: TopbarProps) => {
    return (
        <div className="topbar">
            <h2>Now is {curPlayer} turn!</h2>

            <p>
                It's been about {time} seconds!
            </p>
        </div>
    )
}

export default Topbar;