export default class Pad {
    padId: number
    selected = false
    label: string = ""

    constructor(padId: number) {
        this.padId = padId;
    }
}