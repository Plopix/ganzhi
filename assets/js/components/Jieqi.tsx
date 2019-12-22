import React, { useState } from 'react';
import { GetRank } from "../functions";

import {
    ToggleButtonGroup,
    ToggleButton
} from 'react-bootstrap';

export default function Jiequi ({ year, dayOfYear, isLeapYear }) {
    const [value, setValue] = useState('wen');
    const rank = GetRank(year);
    const startingPoint = isLeapYear ? 81 : 80;
    const styles = {
        arrow: {
            transform: "rotate(" + (dayOfYear - startingPoint) * (360 / (isLeapYear ? 366 : 365)) + "deg)"
        }
    };

    const handleChange = val => setValue(val);
    return <div className="jiequi-container layer-container">
        <h1>Jieqi</h1>
        <div className="inner">
            <img src="/images/jieqi/arrow.png" style={styles.arrow}/>
            <img src="/images/jieqi/jieqi.png"/>
            <img src={"/images/jieqi/bagua" + value + ".png"}/>
            <img src={"/images/zodiac/zodiac-" + rank + ".png"}/>
        </div>
        <ToggleButtonGroup type="radio" name="bagua" value={value} onChange={handleChange} className="buttons-group-options">
            <ToggleButton variant="outline-dark" value={"fuxi"}>Ciel antérieur <br /> Fuxi</ToggleButton>
            <ToggleButton variant="outline-dark" value={"wen"}>Ciel postérieur <br /> Roi Wen</ToggleButton>
        </ToggleButtonGroup>
    </div>
}
