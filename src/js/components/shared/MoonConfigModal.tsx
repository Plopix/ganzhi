import React, { FunctionComponent, useState } from 'react';
import { elementSequenceOrder, MoonSequenceDefinition, polaritySequenceOrder } from '../App/Type';
import { Alert, Button, Form, Modal, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { translator } from '../../Translator';

const MoonConfigModal: FunctionComponent<{
    moons: any[];
    defaultsMoonDefinition: MoonSequenceDefinition;
    onSave: Function;
    onClose: Function;
}> = ({ onSave, defaultsMoonDefinition, onClose, moons }) => {
    const [index, setIndex] = useState(defaultsMoonDefinition.index);
    const [polarity, setPolarity] = useState(defaultsMoonDefinition.polarity);
    const [element, setElement] = useState(defaultsMoonDefinition.element);
    const [leapIndex, setLeapIndex] = useState(defaultsMoonDefinition.leapIndex);
    const [errors, setError] = useState([]);

    return (
        <>
            <Modal.Body>
                <div className={'moon-config d-flex flex-column justify-content-center'}>
                    {errors.length > 0 && (
                        <Alert variant="danger" onClose={() => setError([])} dismissible>
                            <Alert.Heading>{translator.t('form.error.main')}</Alert.Heading>
                            <ul>
                                {errors.map((error, index) => {
                                    return <li key={index}>{translator.t(error)}</li>;
                                })}
                            </ul>
                        </Alert>
                    )}
                    <Form.Control
                        as="select"
                        custom
                        value={index}
                        onChange={(event) => {
                            setIndex(parseInt(event.target.value));
                        }}
                    >
                        <option disabled value={-1}>
                            {translator.t('moon.select')}
                        </option>
                        {moons.map((date, index) => {
                            return (
                                <option key={index} value={index}>
                                    {date.format('LL')} - {translator.t('moon')} #{index + 1}
                                </option>
                            );
                        })}
                    </Form.Control>
                    <hr />
                    <div className="button-group-container m-auto">
                        <ToggleButtonGroup
                            type="radio"
                            name="element"
                            value={element}
                            onChange={(value) => setElement(value)}
                            className="buttons-group-options"
                        >
                            {elementSequenceOrder.map((value) => {
                                return (
                                    <ToggleButton key={value} variant="outline-dark" value={value}>
                                        {translator.t(value)}
                                    </ToggleButton>
                                );
                            })}
                        </ToggleButtonGroup>
                    </div>
                    <hr />
                    <div className="button-group-container m-auto">
                        <ToggleButtonGroup
                            type="radio"
                            name="polarity"
                            value={polarity}
                            onChange={(value) => setPolarity(value)}
                            className="buttons-group-options"
                        >
                            {polaritySequenceOrder.map((value) => {
                                return (
                                    <ToggleButton key={value} variant="outline-dark" value={value}>
                                        {value}
                                    </ToggleButton>
                                );
                            })}
                        </ToggleButtonGroup>
                    </div>
                    {moons.length > 12 && (
                        <>
                            <hr />
                            <div className={'d-flex flex-row'}>
                                <div>
                                    <p>{translator.t('leapmoon')}</p>
                                </div>
                                <Form.Control
                                    as="select"
                                    custom
                                    value={leapIndex}
                                    onChange={(event) => {
                                        setLeapIndex(parseInt(event.target.value));
                                    }}
                                >
                                    <option disabled value={-1}>
                                        {translator.t('leapmoon.select')}
                                    </option>
                                    {moons.map((date, index) => {
                                        if (index === 0) {
                                            return;
                                        }
                                        return (
                                            <option key={index} value={index}>
                                                {date.format('LL')} - {translator.t('moon')} #{index + 1}
                                            </option>
                                        );
                                    })}
                                </Form.Control>
                            </div>
                        </>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose()}>
                    {translator.t('close')}
                </Button>
                <Button
                    variant="dark"
                    onClick={() => {
                        const errors = [];
                        if (index === -1) {
                            errors.push('form.error.date');
                        }
                        if (element === '') {
                            errors.push('form.error.element');
                        }
                        if (polarity === '') {
                            errors.push('form.error.polarity');
                        }

                        if (leapIndex === -1 && moons.length > 12) {
                            errors.push('form.error.leapmoon');
                        }
                        if (errors.length > 0) {
                            setError(errors);
                        } else {
                            onSave(index, element, polarity, leapIndex);
                            onClose();
                        }
                    }}
                >
                    {translator.t('save')}
                </Button>
            </Modal.Footer>
        </>
    );
};

export default MoonConfigModal;
