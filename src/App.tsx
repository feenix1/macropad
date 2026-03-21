import { useState } from "react";
import Button from "./components/Button";
import "./App.css";
import ActionEditor from "./views/action-editor/ActionEditor";
import "@fontsource-variable/instrument-sans/wdth.css"

import { AiOutlineSisternode } from "react-icons/ai";
import { HiViewGridAdd } from "react-icons/hi";
import { HiSun } from "react-icons/hi2";

function App() {

  enum Tab {
    ActionEditor,
    LightingEditor,
    MappingEditor
  } 

  function renderCurrentTab(currentTab: Tab) {
    switch (currentTab) {
      case Tab.ActionEditor:
        return <ActionEditor />;
      case Tab.LightingEditor:
        return <div />;
      case Tab.MappingEditor:
        return <div />;
    }
  }

  return (
    <main className="container">
      <div className="navbar">
        <button className="navbar-button"></button>
        <button className="navbar-button"></button>
      </div>
      <div className="pad-panel">
        <div className="pad-container">
          {[...Array(64)].map((_, i) => <PadButton key={i} />)}
        </div>
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

function PadButton() {
  return(
    <button className="pad-button">
      <p>Pad Name</p>
    </button>
  )
}

export default App;
