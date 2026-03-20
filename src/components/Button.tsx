import "./Button.css";
import { ReactNode } from "react";

export default function Button(props: { onClick: () => void, children: ReactNode }) {
    return (
        <button className="button" onClick={props.onClick}>
            {props.children}
        </button>
    )
}