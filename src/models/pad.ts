import { ActionType } from "./action-type";

export default class Pad {
    color: PadColor
    position: GridPosition | ControlPosition
    selected = false
    label: string = ""
    actionType: ActionType = ActionType.None
    
    constructor(position: GridPosition | ControlPosition) {
        this.color = PadColor.OFF;
        this.position = position;
    }
}

export class ControlPosition {
    index: number;
    constructor(index: number) {
        this.index = index; 
    }
}

export class GridPosition {
    x: number;
    y: number;

    constructor(x: number, y: number) {
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
            return "#df2222"
        case PadColor.GREEN:
            return "#8dcc33"
        case PadColor.AMBER:
            return "#ffa012"
        case PadColor.DIM_GREEN:
            return "#73802a"
        case PadColor.DIM_RED:
            return "#830505"
        case PadColor.ORANGE:
            return "#ff7300"
        case PadColor.YELLOW:
            return "#ffaa00"
        default:
            return "#000000"
    }
}
