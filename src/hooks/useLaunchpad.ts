import { invoke } from "@tauri-apps/api/core";
import { PadColor } from "../models/pad";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useState } from "react";

export interface LaunchpadConnection {
    isConnected: () => Promise<boolean>,
    connect: () => Promise<boolean>,
    disconnect: () => Promise<boolean>,
    registerListeners: (listeners: LaunchpadEventListeners) => Promise<void>,
    deregisterListeners: () => void,
    listenersRegistered: () => boolean,
    lightControlPad: (index: number, padColor: PadColor) => Promise<boolean>,
    lightGridPad: (x: number, y: number, padColor: PadColor) => Promise<boolean>,
}

export interface LaunchpadEventListeners {
    onControlPressed: (index: number) => void,
    onControlReleased: (index: number) => void,
    onGridPressed: (x: number, y: number) => void,
    onGridReleased: (x: number, y: number) => void,
}

interface ControlButtonPayload {
    index: number,
}

interface GridButtonPayload {
    x: number,
    y: number,
}

export default function useLaunchpad() : LaunchpadConnection {
    const [controlPressedUnlistener, setControlPressedUnlistener] = useState<UnlistenFn | null>(null);
    const [controlReleasedUnlistener, setControlReleasedUnlistener] = useState<UnlistenFn | null>(null);
    const [gridPressedUnlistener, setGridPressedUnlistener] = useState<UnlistenFn | null>(null);
    const [gridReleasedUnlistener, setGridReleasedUnlistener] = useState<UnlistenFn | null>(null);

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

    async function registerListeners(listeners: LaunchpadEventListeners) {
        console.log("Registering listeners...");
        setControlPressedUnlistener(await listen<ControlButtonPayload>('control-button-pressed', (event) => {
            console.log("control pressed event recieved");
            listeners.onControlPressed(event.payload.index);
        }));
        setControlReleasedUnlistener(await listen<ControlButtonPayload>('control-button-released', (event) => {
            console.log("control released event recieved");
            listeners.onControlReleased(event.payload.index);
        }));
        setGridPressedUnlistener(await listen<GridButtonPayload>('button-pressed', (event) => {
            console.log("grid pressed event recieved");
            listeners.onGridPressed(event.payload.x, event.payload.y);
        }));
        setGridReleasedUnlistener(await listen<GridButtonPayload>('button-released', (event) => {
            console.log("grid released event recieved");
            listeners.onGridReleased(event.payload.x, event.payload.y);
        }));
    }

    function listenersRegistered() {
        return controlPressedUnlistener != null &&
        controlReleasedUnlistener != null &&
        gridPressedUnlistener != null &&
        gridReleasedUnlistener != null;
    }

    function deregisterListeners() {
        if (controlPressedUnlistener != null) {
            controlPressedUnlistener();
            setControlPressedUnlistener(null);
        }
        if (controlReleasedUnlistener != null) {
            controlReleasedUnlistener();
            setControlReleasedUnlistener(null);
        }
        if (gridPressedUnlistener != null) {
            gridPressedUnlistener();
            setGridPressedUnlistener(null);
        }
        if (gridReleasedUnlistener != null) {
            gridReleasedUnlistener();
            setGridReleasedUnlistener(null);
        }
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
        registerListeners,
        deregisterListeners,
        listenersRegistered,
        lightControlPad,
        lightGridPad,
    };
}