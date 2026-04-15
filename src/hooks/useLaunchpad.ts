import { invoke } from "@tauri-apps/api/core";
import { PadColor } from "../models/pad";

export interface LaunchpadConnection {
    isConnected: () => Promise<boolean>,
    connect: () => Promise<boolean>,
    disconnect: () => Promise<boolean>,
    lightControlPad: (index: number, padColor: PadColor) => Promise<boolean>,
    lightGridPad: (x: number, y: number, padColor: PadColor) => Promise<boolean>,
}

export default function useLaunchpad() : LaunchpadConnection {
    async function isConnected() : Promise<boolean> {
        return await invoke('is_connected')
    }

    async function connect() : Promise<boolean> {
        const err_string = await invoke('connect_launchpad');
        return err_string == null;
    }

    async function disconnect() {
        const err_string = await invoke('disconnect_launchpad');
        return err_string == null;
    }

    async function lightControlPad(index: number, padColor: PadColor) {
        const err_string = await invoke('light_grid_pad', {index: index, color: padColor.toString()})
        return err_string == null;
    }

    async function lightGridPad(x: number, y: number, padColor: PadColor){
        const err_string = await invoke('light_grid_pad', {x: x, y: y, color: padColor.toString()})
        return err_string == null;
    }

    return {
        isConnected,
        connect,
        disconnect,
        lightControlPad,
        lightGridPad,
    };
}