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

  const [currentTab, setCurrentTab] = useState<Tab>(Tab.ActionEditor);

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
      <div className="tab-bar">
        <button className="tab-button" onClick={() => setCurrentTab(Tab.ActionEditor)}>
          <AiOutlineSisternode size={24} />
          Actions
        </button>
        <button className="tab-button" onClick={() => setCurrentTab(Tab.LightingEditor)}>
          <HiSun size={24} />
          Lighting
        </button>
        <button className="tab-button" onClick={() => setCurrentTab(Tab.MappingEditor)}>
          <HiViewGridAdd size={24} />
          Mapping
        </button>
      </div>
      <div className="tab-content">
        {renderCurrentTab(currentTab)}
      </div>
    </main>
  );
}

export default App;
