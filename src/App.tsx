import { createContext, useState } from "react";
import "./App.css";
import "@fontsource-variable/instrument-sans/wdth.css"
import Pad from "./models/pad";
import { ActionType } from "./models/action-type";
import AppData from "./models/app-data";

const AppContext = createContext(new AppData());

function App() {
  return (
    <AppContext>
      <main className="container">
        <div className="navbar">
          <button className="navbar-button"></button>
          <button className="navbar-button"></button>
        </div>
        <div className="pad-panel">
          <div className="pad-container">
            {pads.map((pad, i) => <PadButtonGridSquare key={i} pad={pad} onClick={selectPad} />)}
          </div>
        </div>
        <ConfigurePanel pad={getSelectedPad()} onConfigUpdate={handleConfigUpdate}/>
      </main>
    </AppContext>
  );
}

function ConfigurePanel(
  {pad, onConfigUpdate} : 
  {pad?: Pad, onConfigUpdate?: (pad: Pad) => void }
) {

  function handleConfigUpdate(updatedPad: Pad) {
    onConfigUpdate?.(updatedPad);
  }

  return (
    <div className="configure-panel">
      <h1>Configure Pad</h1>
      {pad ? <ConfigurePanelContent pad={pad} onConfigUpdate={handleConfigUpdate}/> : <p>No pad selected</p>}
    </div>
  )
}

function ConfigurePanelContent(
  {pad, onConfigUpdate} : 
  {pad: Pad, onConfigUpdate?: (pad: Pad) => void }
) {

  function handleChangeLabel(e: React.ChangeEvent<HTMLInputElement>) {
    pad.label = e.target.value;
    onConfigUpdate?.(pad);
  }

  function handleChangeActionType(actionType: ActionType) {
    pad.actionType = actionType;
    onConfigUpdate?.(pad);
  }

  return (
    <>
      <div>
        <p>Label</p>
        <input type="text" value={pad.label} onChange={handleChangeLabel} />
      </div>
      <div>
        <p>Input Type</p>
        <div className="input-types">
          <button onClick={() => handleChangeActionType(ActionType.Keybind)}>Keybind</button>
          <button onClick={() => handleChangeActionType(ActionType.Soundboard)}>Soundboard</button>
          <button onClick={() => handleChangeActionType(ActionType.Command)}>Command</button>
        </div>
      </div>
    </>
  )
}

function PadButtonControl({pad, onClick}: {pad: Pad, onClick: (index: number) => void}) {
  const className = pad.selected ? "pad-button pad-button-selected" : "pad-button"

  function handleClick() {
    onClick(pad.padId);
  }

  return(
    <button className={className} onClick={handleClick}>
      {pad.label}
    </button>
  )
}

function PadButtonGridSquare({pad, onClick}: {pad: Pad, onClick: (index: number) => void}) {
  const className = pad.selected ? "pad-button pad-button-selected" : "pad-button"

  function handleClick() {
    onClick(pad.padId);
  }

  return(
    <button className={className} onClick={handleClick}>
      {pad.label}
    </button>
  )
}

function PadButtonGridRound({pad, onClick}: {pad: Pad, onClick: (index: number) => void}) {
  const className = pad.selected ? "pad-button pad-button-selected" : "pad-button"

  function handleClick() {
    onClick(pad.padId);
  }

  return(
    <button className={className} onClick={handleClick}>
      {pad.label}
    </button>
  )
}

export default App;
