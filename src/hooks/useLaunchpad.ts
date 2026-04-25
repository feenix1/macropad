import { invoke } from "@tauri-apps/api/core";
import { PadColor } from "../models/pad";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useRef, useState } from "react";

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
    const unlisteners = useRef<UnlistenFn[]>([]);
    const cancelled = useRef(false);

    async function isConnected() : Promise<boolean> {
        try {
            const connected: boolean = await invoke("is_connected");
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
        cancelled.current = false;

        const unlistens  = await Promise.all([
            listen<ControlButtonPayload>('control-button-pressed', (event) => {
                listeners.onControlPressed(event.payload.index);
            }),
            listen<ControlButtonPayload>('control-button-released', (event) => {
                listeners.onControlReleased(event.payload.index);
            }),
            listen<GridButtonPayload>('button-pressed', (event) => {
                listeners.onGridPressed(event.payload.x, event.payload.y);
            }),
            listen<GridButtonPayload>('button-released', (event) => {
                listeners.onGridReleased(event.payload.x, event.payload.y);
            }),
        ]); 

        if (cancelled.current) {
            unlistens.forEach((unlisten) => unlisten());
            return;
        }

        unlisteners.current = unlistens;
    }

    function listenersRegistered() {
        return unlisteners.current.length == 4;
    }

    function deregisterListeners() {
        cancelled.current = true;
        unlisteners.current.forEach((unlisten) => unlisten());
        unlisteners.current = [];
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