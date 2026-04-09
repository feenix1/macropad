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
    DIM_RED = "dim_red",
    RED = "red",
    DIM_GREEN = "dim_green",
    GREEN = "green",
    ORANGE = "orange",
    AMBER = "amber",
    YELLOW = "yellow",
}

export function padColorToCssVar(padColor: PadColor) {
    return `var(--${padColor.toString()})`
}

export function padColorToHex(padColor: PadColor) {
    switch (padColor) {
        case PadColor.OFF:
            return "#000000";
        case PadColor.RED:
            return "#fc6c53"
        case PadColor.GREEN:
            return "#67b33c"
        case PadColor.AMBER:
            return "#ffd21c"
        case PadColor.DIM_GREEN:
            return "#49802a"
        case PadColor.DIM_RED:
            return "#c95642"
        case PadColor.ORANGE:
            return "#fd9c1b"
        case PadColor.YELLOW:
            return "#fbe14c"
        default:
            return "#000000"
    }
}
