import React from "react";
import Moon from 'react-moon';

export default function GMoon ({ phase, size }) {
    return <div className={"moon"}>
        <Moon phase={phase.toFixed(4)} size={size} rotation='0' border="1px solid darkgrey"/>
    </div>
}
