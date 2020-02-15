import React, {useState} from 'react';
import {GetRank} from "../functions";
import {Periods} from "../periods";

import {
    ToggleButtonGroup,
    ToggleButton,
    Modal
} from 'react-bootstrap';

export default function Jiequi({year, dayOfYear, isLeapYear}) {
    const [value, setValue] = useState('wen');
    const [show, setShow] = useState(false);
    const rank = GetRank(year);
    const startingPoint = isLeapYear ? 81 : 80;
    const angle = (dayOfYear - startingPoint) * (360 / (isLeapYear ? 366 : 365));
    const styles = {
        arrow: {
            transform: "rotate(" + angle + "deg)"
        }
    };
    // Angle 0 is Period 18 (started by 0)
    let index = Math.floor(angle / (360 / 72));
    if (index < 0) {
        index = 72 + index;
    }
    index = (index + 18) % 72;

    const handleChange = val => setValue(val);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const periods = Periods[index];

    return <div className="jiequi-container layer-container">
        <h1>Jieqi</h1>
        <div className="inner" onDoubleClick={handleShow}>
            <img src="/images/jieqi/arrow.png" style={styles.arrow}/>
            <img src="/images/jieqi/jieqi.png"/>
            <img src={"/images/jieqi/bagua" + value + ".png"}/>
            <img src={"/images/zodiac/zodiac-" + rank + ".png"}/>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Period</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {periods.map((line, index) => <li key={index}>{line}</li>)}
                    </ul>
                </Modal.Body>
            </Modal>
        </div>
        <div className="button-group-container">
            <ToggleButtonGroup type="radio" name="bagua" value={value} onChange={handleChange} className="buttons-group-options">
                <ToggleButton variant="outline-dark" value={"fuxi"}>Ciel antérieur <br/> Fuxi</ToggleButton>
                <ToggleButton variant="outline-dark" value={"wen"}>Ciel postérieur <br/> Roi Wen</ToggleButton>
            </ToggleButtonGroup>
        </div>
    </div>
}
