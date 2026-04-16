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
        try {
            const connected: boolean = await invoke("is_connected");
            console.log("isConnected: " + connected);
            return connected;
            
        } catch (error) {
            console.error("isConnected: " + error);
            return false; 
        }
    }

    async function connect() : Promise<boolean> {
        try {
            await invoke('connect_launchpad')
        } catch (error) {
            console.error("connect: " + error)
            return false; 
        }
        return true;
    }

    async function disconnect() {
        try {
            await invoke('disconnect_launchpad')
        } catch (error) {
            console.error("disconnect: " + error)
            return false; 
        }
        return true;
    }

    async function lightControlPad(index: number, padColor: PadColor) {
        try {
            await invoke('light_control_pad', {index: index, color: padColor.toString()});
        } catch (error) {
            console.error("lightControlPad: " + error);
            return false; 
        }
        return true;
    }

    async function lightGridPad(x: number, y: number, padColor: PadColor){
        try {
            await invoke('light_grid_pad', {x: x, y: y, color: padColor.toString()});
        } catch (error) {
            console.error("lightGridPad: " + error);
            return false; 
        }
        return true;
    }

    return {
        isConnected,
        connect,
        disconnect,
        lightControlPad,
        lightGridPad,
    };
}