import { ColorsEnum } from "../enums/ColorsEnum";
import { CheckerModel } from "./CheckerModel";

export class CellModel {
    x: number;
    y: number;
    color: ColorsEnum;
    checker: CheckerModel | null;
    available: boolean = false;

    constructor(color: ColorsEnum, x: number, y: number) {
        this.color = color;
        this.checker = null;
        this.x = x;
        this.y = y;
    }
}