import { ControlPad, GridPad } from "./pad"
import { invoke } from "@tauri-apps/api/core";

export default class Launchpad {
    controlPads: Array<ControlPad>
    gridPads: Array<GridPad>

    constructor() {
        this.controlPads = Array(9).map((_, i) => { return new ControlPad(i) });
        this.gridPads = Array(9 * 9).map((_, i) => { return new GridPad(i % 9, Math.floor(i / 9)) })
    }
}