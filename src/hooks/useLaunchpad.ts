import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default interface LaunchpadConnection {
    isConnected: boolean


}

export default function useLaunchpad() {
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
    }, [isConnected]);
    
    setIsConnected(invoke("launchpad_connected"))

}