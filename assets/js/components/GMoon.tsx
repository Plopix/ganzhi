import React, {FunctionComponent} from 'react';
import Moon from 'react-moon';

const GMoon: FunctionComponent<{ phase: number, size: number }> = ({phase, size}) => {
    return <div className={"moon"}>
        <Moon phase={phase} size={size} rotation='0' border="1px solid darkgrey"/>
    </div>
};

export default GMoon;
