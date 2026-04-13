import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface LaunchpadConnection {
    isConnected: boolean
    lightControlPad: () => Promise<void>
    lightGridPad: () => Promise<void>
}

export default function useLaunchpad() : LaunchpadConnection {
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        

    }, [isConnected]);

    async function lightControlPad() {

    }

    async function lightGridPad() {

    }

    return {
        isConnected,
        lightControlPad,
        lightGridPad,
    };
}