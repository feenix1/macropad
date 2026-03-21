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
        <div className="action-li-left">
          <p className="action-li-title">Action Name</p>
        </div>
        <div className="action-li-right">
          <IconButton icon={<FaTrash />} onClick={() => null}/>
        </div>
    </div>
  )
}

export default ActionEditor;