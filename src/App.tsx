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
      <div className="configure-panel">
        <h1>Configure Pad</h1>
        <div>
          <p>Label</p>
          <input type="text" />
        </div>
        <div>
          <p>Input Type</p>
          <select name="input-type" id="input-type">
            <option value="key">Key</option>
            <option value="macro">Macro</option>
            <option value="shortcut">Shortcut</option>
          </select>
        </div>
      </div>
    </main>
  );
}

function PadButton({pad, onClick}: {pad: Pad, onClick: (index: number) => void}) {
  const className = pad.selected ? "pad-button pad-button-selected" : "pad-button"

  function handleClick() {
    onClick(pad.padId);
  }

  return(
    <button className={className} onClick={handleClick}>
    </button>
  )
}

export default App;
