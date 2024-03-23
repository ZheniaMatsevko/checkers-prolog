import {PlayerTypesEnum} from "../enums/PlayerTypesEnum";
import {ColorsEnum} from "../enums/ColorsEnum";

export class PlayerModel {
    playerType: PlayerTypesEnum;
    playerColor: ColorsEnum;

    constructor(playerType: PlayerTypesEnum, playerColor: ColorsEnum) {
        this.playerType = playerType;
        this.playerColor = playerColor;
    }
}