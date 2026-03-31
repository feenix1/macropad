import { ActionType } from "./action-type";

export default class Pad {
    padId: number
    selected = false
    label: string = ""
    actionType: ActionType = ActionType.None

    constructor(padId: number) {
        this.padId = padId;
    }
}