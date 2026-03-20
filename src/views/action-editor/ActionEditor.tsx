import "./ActionEditor.css";

function ActionEditor() {
  return (
    <div className="action-main">
      <ActionList />
    </div>
  );
}

function ActionList() {
  return (
    <div className="action-list">
      <ActionListItem />
      <ActionListItem />
      <ActionListItem />
    </div>
  )
}

function ActionListItem({ }) {
  return (
    <div className="action-list-item">
      <p>Action Name</p>
      <button>Delete</button>
    </div>
  )
}

export default ActionEditor;