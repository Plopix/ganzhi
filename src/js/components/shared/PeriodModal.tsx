import React, { FunctionComponent } from 'react';
import { Modal } from 'react-bootstrap';
import { translator } from '../../Translator';

const PeriodModal: FunctionComponent<{ lines: string[] }> = ({ lines }) => {
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{translator.t('solar.period')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    {lines.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
            </Modal.Body>
        </>
    );
};

export default PeriodModal;
