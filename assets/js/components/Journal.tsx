import React, {FunctionComponent, useState} from 'react';
import {translator} from "../Translator";
import {Button, Modal} from "react-bootstrap";
import {YearCycleRange} from "../functions";
import {useApp} from "./App/Provider";

const Journal: FunctionComponent<{ onClose: Function }> = ({onClose}) => {
    const [state, dispatch] = useApp();

    const [selectedYear, setSelectedYear] = useState(state.year);
    const [filledText, setFilledText] = useState(state.journal[selectedYear] || '');

    const yearCycleStep = 60;
    const range = YearCycleRange(state.year, yearCycleStep);

    return <>
        <Modal.Body className={'journal'}>
            <div className={"d-flex flex-row justify-content-center"}>
                <div className={'year'}><span>{translator.t('year')}</span></div>
                <select value={selectedYear} onChange={event => {
                    const newSelectedYear = parseInt(event.target.value);
                    setSelectedYear(newSelectedYear);
                    setFilledText(state.journal[newSelectedYear] || '');
                }}>
                    {Array(yearCycleStep).fill(0).map((_, index) =>
                        <option key={index} value={range.min + index}>{range.min + index}</option>)}
                </select>
            </div>
            <textarea value={filledText} onChange={event => setFilledText(event.target.value)} />
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => onClose()}>{translator.t('close')}</Button>
            <Button variant="dark" onClick={() => {
                dispatch.saveNote(selectedYear, filledText);
                onClose();
            }}>Save changes</Button>
        </Modal.Footer>
    </>
}

export default Journal;
