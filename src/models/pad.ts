export default class Pad {
    padId: number
    selected = false
    label: string = ""
    // actionType: ActionType


    constructor(padId: number) {
        this.padId = padId;
    }
}