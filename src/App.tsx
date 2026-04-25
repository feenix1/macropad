import { useEffect, useRef, useState } from "react";
import "./App.css";
import "@fontsource-variable/instrument-sans/wdth.css"
import Pad, { padColorToCssVar, PadColor, GridPosition, ControlPosition } from "./models/pad";
import { ActionType } from "./models/action-type";
import useLaunchpad from "./hooks/useLaunchpad";

function App() {
  const [controlPads, setControlPads] = useState(Array(8).fill(null).map((_, i) => new Pad(new ControlPosition(i))));
  const [gridPads, setGridPads] = useState(Array(9 * 8).fill(null).map((_, i) => new Pad(new GridPosition(i % 9, Math.floor(i / 9)))));
  const [selectedPadIndex, setSelectedPadIndex] = useState<number | null>(null);
  const launchpad = useLaunchpad();
  const [isConnected, setIsConnected] = useState(false);


  useEffect(() => {
    let cancelled = false;

    async function connectInputAndHeartbeat() {
      await launchpad.registerListeners({
        onControlPressed: onControlPadPressed,
        onControlReleased: onControlPadReleased,
        onGridPressed: onGridPadPressed,
        onGridReleased: onGridPadReleased,
      });
      while (!cancelled) {
        await launchpad.connect();
        const success = await launchpad.isConnected();
        if (!success) {
          setIsConnected(false);
          console.warn("Failed to connect to launchpad, retrying...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        setIsConnected(true);
        console.log("Connected to launchpad, starting heartbeat...");
        while (!cancelled) {
          const heartbeatSuccess = await launchpad.isConnected();
          console.log("Launchpad connected poll:", heartbeatSuccess);
          if (!heartbeatSuccess) {
            setIsConnected(false);
            launchpad.deregisterListeners();
            await launchpad.disconnect();
            console.warn("Launchpad connection lost, attempting to reconnect...");
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    connectInputAndHeartbeat();
    return () => {      
      cancelled = true;
      launchpad.deregisterListeners();
      launchpad.disconnect();
    }
  }, []);

  // Need to use refs to get the latest pad states in event callbacks,
  // since they only have access to the state at the time they were registered.
  // Even though the function that gets the pads is outside the callbacks!!
  const controlPadsRef = useRef(controlPads);
  const gridPadsRef = useRef(gridPads);
  useEffect(() => {
    controlPadsRef.current = controlPads;
  }, [controlPads]);
  useEffect(() => {
    gridPadsRef.current = gridPads;
  }, [gridPads]);
  function getControlPad(index: number): Pad {
    return controlPadsRef.current[index];
  }
  function getGridPad(x: number, y: number): Pad {
    console.log("getPad", gridPads);
    return gridPadsRef.current[y * 9 + x];
  }
  // Light up pads to yellow since it breaks the pattern of 
  // two colors per shade.
  function onControlPadPressed(index: number) {
    launchpad.lightControlPad(index, PadColor.YELLOW);
    console.log("Control pad pressed:", index);
  }
  function onControlPadReleased(index: number) {
    const pad = getControlPad(index);
    launchpad.lightControlPad(index, pad.color);
  }
  function onGridPadPressed(x: number, y: number) {
    launchpad.lightGridPad(x, y, PadColor.YELLOW);
  }
  function onGridPadReleased(x: number, y: number) {
    const pad = getGridPad(x, y);
    launchpad.lightGridPad(x, y, pad.color);
  }

  useEffect(() => {
    async function updatePadLights() {
      for (let i = 0; i < gridPads.length; i++) {
        const pad = gridPads[i];
        if (pad.position instanceof GridPosition) {
          await launchpad.lightGridPad(pad.position.x, pad.position.y, pad.color);
        } else {
          await launchpad.lightControlPad(pad.position.index, pad.color);
        }
      }
    }
    if (isConnected) {
      updatePadLights();
      console.log("updateLights", gridPads);
    }
  }, [gridPads, isConnected]);

  function handlePadSelect(padIndex: number) {
    setSelectedPadIndex(padIndex);
  }

  function handleConfigUpdate(newPad: Pad) {
    if (selectedPadIndex == null) {
      console.warn("Config update called with no selected pad");
      return;
    }
    const newPads = [...gridPads];
    newPads[selectedPadIndex] = newPad;
    setGridPads(newPads);
    console.log("updatePad", gridPads)
  }

  function getSelectedPad() : Pad | null {
    if (selectedPadIndex == null) {
      return null;
    }
    return gridPads[selectedPadIndex];
  }

  return (
    <main className="container">
      <div className="navbar">
        <button className="navbar-button"></button>
        <button className="navbar-button"></button>
      </div>
      <div className="pad-panel">
        <div className="pad-panel-topinfo">
          <h2>Launchpad Mini MK2</h2>
          <p>
            {
              isConnected ? "Connected" : "Disconnected"
            }
          </p>
        </div>
        <div className="pad-container">
          {
            gridPads.map((_, i) => {
              return <PadButton key={i} pads={gridPads} padIndex={i} selected={i === selectedPadIndex} round={i % 9 == 8} onClick={handlePadSelect} />
            })
          }
        </div>
      </div>
      <ConfigurePanel selectedPad={getSelectedPad()} onConfigUpdate={handleConfigUpdate}/>
    </main>
  );
}

function PadButton({pads, padIndex, selected, round, onClick}: {pads: Pad[], padIndex: number, selected: boolean, round: boolean, onClick?: (padIndex: number) => void}) {
  const className = `pad-button ${selected ? "selected " : ""}${round ? "round" : ""}`;
  
  function getPad(): Pad {
    return pads[padIndex];
  }

  function handleClick() {
    onClick?.(padIndex);
  }
  
  return(
    <button className={className} style={{backgroundColor: `var(--${getPad().color.toString()})`}} onClick={handleClick}>
      {getPad().label}
    </button>
  )
}

function ConfigurePanel({selectedPad, onConfigUpdate}: {selectedPad: Pad | null, onConfigUpdate: (newPad: Pad) => void}) {
  function handleChangeLabel(e: React.ChangeEvent<HTMLInputElement>) {
    if (selectedPad) {
      const newPad: Pad = {...selectedPad, label: e.target.value};
      onConfigUpdate(newPad);
    }
  }
  function handleChangeActionType(actionType: ActionType) {
    if (selectedPad) {
      const newPad: Pad = {...selectedPad, actionType: actionType};
      onConfigUpdate(newPad);
    }
  }
  function handleKeybindDown(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
  }
  return (
    <div className="configure-panel">
      <h1>Configure Pad</h1>
      {
        selectedPad ? 
        <>
          <div>
            <p>Label</p>
            <input type="text" value={selectedPad.label} onChange={handleChangeLabel} />
          </div>
          <div>
            <p>Input Type</p>
            <div className="input-types">
              <button onClick={() => handleChangeActionType(ActionType.None)}>None</button>
              <button onClick={() => handleChangeActionType(ActionType.Keybind)}>Keybind</button>
              <button onClick={() => handleChangeActionType(ActionType.Soundboard)}>Soundboard</button>
              <button onClick={() => handleChangeActionType(ActionType.Command)}>Command</button>
            </div>
          </div>
          <div>
            <p>Color</p>
            <div className="color-options">
              {
                Object.values(PadColor).map((color) => {
                  if (color === PadColor.YELLOW) {
                    return null; // Don't allow user to select yellow since it's used for pressed state
                  }
                  return <ColorOption key={color} color={color} selected={selectedPad.color == color} onClick={() => onConfigUpdate({...selectedPad, color: color})} />
                })
              }
            </div>
          </div>
          <div>
            <p>Keybind</p>
            <input type="text" name="keybind" id="keybind" onKeyDown={handleKeybindDown} />
          </div>
        </>
        : <p>No pad selected</p>
      }
    </div>
  )
}

function ColorOption({color, selected, onClick}: {color: PadColor, selected: boolean, onClick: () => void}) {
  return (
    <button className={`color-option ${selected ? "selected" : ""}`} style={{backgroundColor: padColorToCssVar(color)}} onClick={onClick}></button>
  )
}

export default App;
