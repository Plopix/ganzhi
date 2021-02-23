import React, { FunctionComponent } from 'react';
import { Modal } from 'react-bootstrap';

const PeriodModal: FunctionComponent<{ lines: string[] }> = ({ lines }) => {
    return (
        <Modal.Body>
            <ul>
                {lines.map((line, index) => (
                    <li key={index}>{line}</li>
                ))}
            </ul>
        </Modal.Body>
    );
};

export default PeriodModal;
