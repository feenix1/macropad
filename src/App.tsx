import { useState } from "react";
import Button from "./components/Button";
import "./App.css";
import "@fontsource-variable/instrument-sans/wdth.css"
import Pad from "./models/pad";

function App() {
  const [pads, setPads] = useState<Pad[]>([...Array(64)].map((_, i) => new Pad(i)));

  function selectPad(index: number) {
    setPads(pads.map((pad, i) => {
      if (i != index) {
        pad.selected = false;
        return pad;
      }
      pad.selected = true;
      return pad;
    }));
  }

  function getSelectedPad() {
    return pads.find(pad => pad.selected);
  }

  function handleConfigUpdate(updatedPad: Pad) {
    setPads(pads.map(pad => pad.padId === updatedPad.padId ? updatedPad : pad));
  }

  return (
    <main className="container">
      <div className="navbar">
        <button className="navbar-button"></button>
        <button className="navbar-button"></button>
      </div>
      <div className="pad-panel">
        <div className="pad-container">
          {pads.map((pad, i) => <PadButton key={i} pad={pad} onClick={selectPad} />)}
        </div>
      </div>
      <ConfigurePanel pad={getSelectedPad()} onConfigUpdate={handleConfigUpdate}/>
    </main>
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

  return (
    <>
      <div>
        <p>Label</p>
        <input type="text" value={pad.label} onChange={handleChangeLabel} />
      </div>
      <div>
        <p>Input Type</p>
        <div className="input-types">
          <button>Keybind</button>
          <button>Soundboard</button>
          <button>Command</button>
        </div>
      </div>
    </>
  )
}

function PadButton({pad, onClick}: {pad: Pad, onClick: (index: number) => void}) {
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
