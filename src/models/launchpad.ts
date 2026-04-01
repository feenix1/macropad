import { ControlPad, GridPad } from "./pad"
import { invoke } from "@tauri-apps/api/core";

export default class Launchpad {
    controlPads: Array<ControlPad>
    gridPads: Array<GridPad>

    public async update_pads(): Promise<void> {
        for (let i = 0; i < this.controlPads.length; i++) {
            const pad = this.controlPads[i];
            await invoke("set_control_button_color", { index: pad.index, color: pad.color.toString() });
        }
    }

    constructor() {
        this.controlPads = Array(9).map((_, i) => { return new ControlPad(i) });
        this.gridPads = Array(9 * 9).map((_, i) => { return new GridPad(i % 9, Math.floor(i / 9)) })
    }
}