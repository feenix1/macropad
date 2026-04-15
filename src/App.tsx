import { useEffect, useState } from "react";
import "./App.css";
import "@fontsource-variable/instrument-sans/wdth.css"
import Pad, { padColorToCssVar, PadColor, GridPosition } from "./models/pad";
import { ActionType } from "./models/action-type";
import useLaunchpad from "./hooks/useLaunchpad";

function App() {
  const [gridPads, setGridPads] = useState(Array(9 * 8).fill(null).map((_, i) => new Pad(new GridPosition(i % 9, Math.floor(i / 9)))));
  const [selectedPadIndex, setSelectedPadIndex] = useState<number | null>(null);
  const launchpad = useLaunchpad();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function connect() {
      const success = await launchpad.connect();
      console.log("Connected to launchpad:", success);
      setIsConnected(success);
    }
    connect();
  }, []);

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
          <p>Disconnected</p>
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
  const className = `pad-button ${selected ? "selected" : ""} ${round ? "round" : ""}`;
  
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
