import React, {FunctionComponent, useEffect, useState} from 'react';
import {translator} from "../Translator";
import {Button, Modal} from "react-bootstrap";
import {useApp} from "./App/Provider";

const Journal: FunctionComponent<{ onClose: Function }> = ({onClose}) => {
    const [state, dispatch] = useApp();
    const [filledText, setFilledText] = useState(state.journal[state.year] || '');
    useEffect(() => {
        setFilledText(state.journal[state.year] || '');
    }, [state.year]);
    return <>
        <Modal.Body className={'journal'}>
            <textarea value={filledText} onChange={event => setFilledText(event.target.value)} />
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => onClose()}>{translator.t('close')}</Button>
            <Button variant="dark" onClick={() => {
                dispatch.saveNote(filledText);
                onClose();
            }}>{translator.t('save')}</Button>
        </Modal.Footer>
    </>
}

export default Journal;
