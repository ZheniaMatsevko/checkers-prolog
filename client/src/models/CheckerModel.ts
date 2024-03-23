import { ColorsEnum } from "../enums/ColorsEnum";
import {PlayerModel} from "./PlayerModel";

export class CheckerModel {
    color: ColorsEnum;
    player: PlayerModel;
    isKing: boolean = false;

    constructor(color: ColorsEnum, player: PlayerModel) {
        this.color = color;
        this.player = player;
    }
}