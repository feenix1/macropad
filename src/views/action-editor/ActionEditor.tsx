import "./ActionEditor.css";
import IconButton from "../../components/IconButton";
import { FaTrash } from "react-icons/fa6";

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
      <IconButton icon={<FaTrash />} onClick={() => null}/>
    </div>
  )
}

export default ActionEditor;