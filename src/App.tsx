import { useState } from "react";
import "./App.css";
import "@fontsource-variable/instrument-sans/wdth.css"
import Pad, { padColorToHex, padColorToCssVar, PadColor } from "./models/pad";
import { ActionType } from "./models/action-type";

function App() {
  const [gridPads, setGridPads] = useState(Array(8 * 8).fill(null).map(() => new Pad() ));
  const [selectedPadIndex, setSelectedPadIndex] = useState<number | null>(null);

  function handlePadSelect(padIndex: number) {
    setSelectedPadIndex(padIndex);
  }

  function handlePadUpdate(newPad: Pad) {
    if (selectedPadIndex == null) {
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
              return <PadGridButton key={i} pads={gridPads} padIndex={i} selected={i === selectedPadIndex} onClick={handlePadSelect} />
            })
          }
        </div>
      </div>
      <ConfigurePanel selectedPad={getSelectedPad()} onConfigUpdate={handlePadUpdate}/>
    </main>
  );
}

function PadGridButton({pads, padIndex, selected, onClick}: {pads: Pad[], padIndex: number, selected: boolean, onClick?: (padIndex: number) => void}) {
  const className = selected ? "pad-button selected" : "pad-button"
  
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
