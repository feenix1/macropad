import { ReactElement } from "react";
import "./IconButton.css";

export default function IconButton(props: { icon: ReactElement, onClick: () => void }) {
    return (
        <button className="icon-button" onClick={props.onClick}>
            {props.icon}
        </button>
    )
}