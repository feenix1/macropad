import { createContext, SetStateAction, useContext, useState } from "react";
import "./App.css";
import "@fontsource-variable/instrument-sans/wdth.css"
import Pad from "./models/pad";
import { ActionType } from "./models/action-type";
import Launchpad from "./models/launchpad";

const LaunchpadContext = createContext<[Launchpad, React.Dispatch<SetStateAction<Launchpad>>]>(null as any);

function App() {
  const [launchpad, setLaunchpad] = useState<Launchpad>(new Launchpad());
  const [selectedPad, setSelectedPad] = useState<Pad>(undefined);

  return (
    <LaunchpadContext.Provider value={[launchpad, setLaunchpad]}>
      <main className="container">
        <div className="navbar">
          <button className="navbar-button"></button>
          <button className="navbar-button"></button>
        </div>
        <div className="pad-panel">
          <div className="pad-container">
            {launchpad.gridPads.map((pad, i) => <PadGridButtonSquare key={i} pad={pad} onClick={selectPad} />)}
          </div>
        </div>
        <ConfigurePanel/>
      </main>
    </LaunchpadContext.Provider>
  );
}

function ConfigurePanel({selectedPad, on}) {

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
            <button onClick={() => handleChangeActionType(ActionType.Keybind)}>Keybind</button>
            <button onClick={() => handleChangeActionType(ActionType.Soundboard)}>Soundboard</button>
            <button onClick={() => handleChangeActionType(ActionType.Command)}>Command</button>
          </div>
        </div>
      </>
      : <p>No pad selected</p>}
    </div>
  )
}


function PadControlButton({pad, onClick}: {pad: Pad, onClick: (index: number) => void}) {
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

function PadGridButtonSquare({pad, onClick}: {pad: Pad, onClick: (index: number) => void}) {
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

function PadGridButtonRound({pad, onClick}: {pad: Pad, onClick: (index: number) => void}) {
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
