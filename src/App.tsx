import { useState } from "react";
import Button from "./components/Button";
import "./App.css";
import "@fontsource-variable/instrument-sans/wdth.css"
import Pad from "./models/pad";

function App() {
  const [pads, setPads] = useState<Pad[]>([...Array(64)].map((_, i) => new Pad(`Pad ${i + 1}`)));

  return (
    <main className="container">
      <div className="navbar">
        <button className="navbar-button"></button>
        <button className="navbar-button"></button>
      </div>
      <div className="pad-panel">
        <PadContainer pads={pads}/>
      </div>
      <div className="configure-panel">
        <h1>Configure Pad</h1>
        <p>Label</p>
        <input type="text" />
        <p>Input Type</p>
        <select name="input-type" id="input-type">
          <option value="key">Key</option>
          <option value="macro">Macro</option>
          <option value="shortcut">Shortcut</option>
        </select>
      </div>
    </main>
  );
}

function PadContainer({pads}: {pads: Pad[]}) {

  return (
    <div className="pad-container">
      {pads.map((pad, i) => <PadButton key={i} selected={pad.selected} />)}
    </div>
  )
}

function PadButton({onClick, selected}: {onClick: () => void, selected: boolean}) {

  const className = selected ? "pad-button pad-button-selected" : "pad-button"
  return(
    <button className={className} onClick={onClick}>
      <p>Pad Name</p>
    </button>
  )
}

export default App;
