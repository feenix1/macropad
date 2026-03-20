import { useState } from "react";
import Button from "./components/Button";
import "./App.css";
import ActionEditor from "./views/action-editor/ActionEditor";

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
        <button className="tab-button" onClick={() => setCurrentTab(Tab.ActionEditor)}>Action Editor</button>
        <button className="tab-button" onClick={() => setCurrentTab(Tab.LightingEditor)}>Lighting Editor</button>
        <button className="tab-button" onClick={() => setCurrentTab(Tab.MappingEditor)}>Mapping Editor</button>
      </div>
      <div className="tab-content">
        {renderCurrentTab(currentTab)}
      </div>
    </main>
  );
}

export default App;
