import { ActionType } from "./action-type";

export default class Pad {
    color: PadColor

    selected = false
    label: string = ""
    actionType: ActionType = ActionType.None
    
    constructor() {
        this.color = PadColor.OFF;
    }
}

export class ControlPad extends Pad {
    index: number

    constructor(index: number) {
        super();
        this.index = index;
    }
}

export class GridPad extends Pad {
    x: number
    y: number

    constructor(x: number, y: number) {
        super()
        this.x = x;
        this.y = y;
    }
}

export enum PadColor {
    OFF = "off",
    RED = "red",
    GREEN = "green",
    AMBER = "amber",
    DIM_GREEN = "dim_green",
    DIM_RED = "dim_red",
    ORANGE = "orange",
    YELLOW = "yellow",
}
