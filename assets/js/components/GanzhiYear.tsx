import React, {FunctionComponent, useState} from 'react';
import {GetRank} from '../functions';
import {Alert, Button, Form, Modal, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {useApp} from "./App/Provider";
import {elementSequenceOrder, MoonSequenceDefinition, polaritySequenceOrder} from "./App/Type";
import {translator} from "../Translator";

const GanzhiYear: FunctionComponent = () => {
    const [state, dispatch] = useApp();
    const [show, setShow] = useState(false);
    const countEnergy = 6;
    const countElement = 5;
    const isLeapYear = state.isLeapYear;
    const year = state.year;
    const dayOfYear = state.dayOfYear;
    const moons = state.moons;
    const moonSequence = state.moonSequence;

    const adjustedRank = (dayOfYear < 20 ? GetRank(year - 1) : GetRank(year));
    const startingPoint = isLeapYear ? 81 : 80;
    const centerImage = year.realModulo(2) === 0 ? "/images/ganzhiyear/yangyear.png" : "/images/ganzhiyear/yinyear.png";
    const numberbgclass = year.realModulo(2) === 0 ? "center-number white" : "center-number black";

    const styles = {
        energy: {
            transform: "rotate(" + (adjustedRank * -(360 / countEnergy)) + "deg)"
        },
        element: {
            transform: "rotate(" + (adjustedRank * -(360 / countElement)) + "deg)"
        },
        arrow: {
            transform: "rotate(" + (dayOfYear - startingPoint) * (360 / (isLeapYear ? 366 : 365)) + "deg)"
        }
    };


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return <div className="ganzhiyear-container layer-container">
        <h1>{translator.t('ganzhiyear.title')}</h1>
        <div className="inner" onDoubleClick={handleShow}>
            <img src="/images/ganzhiyear/arrow.png" style={styles.arrow} alt="" />
            <img src="/images/ganzhiyear/background.png" alt="" />
            <img src="/images/ganzhiyear/energy.png" style={styles.energy} alt="" />
            <img src="/images/ganzhiyear/element.png" style={styles.element} alt="" />
            <img src={'/images/ganzhiyear/arrows/arrow-' + adjustedRank + '.png'} alt="" />

            {moons.map((date, index) => {
                const style = {
                    transform: "rotate(" + (90 + date.dayOfYear() - startingPoint) * (360 / (isLeapYear ? 366 : 365)) + "deg)",
                };
                if (moonSequence.index === -1) {
                    return <img key={'moon' + index} src="/images/moons/default.png" style={style} alt="" />
                }

                const elementSequenceIndexStart = elementSequenceOrder.indexOf(moonSequence.element);
                const polarityStart = polaritySequenceOrder.indexOf(moonSequence.polarity);

                let eIndex: number = +(elementSequenceIndexStart + index);
                let pIndex: number = +(polarityStart + index);

                if (index >= moonSequence.leapIndex && moonSequence.leapIndex !== -1) {
                    eIndex--;
                    pIndex--;
                }

                const element = elementSequenceOrder[eIndex.realModulo(elementSequenceOrder.length)];
                const polarity = polaritySequenceOrder[pIndex.realModulo(polaritySequenceOrder.length)];

                return <img key={'moon' + index} src={'/images/moons/' + element + '-' + polarity + '.png'} style={style} alt="" />

            })}

            <img src={centerImage} className="element" style={styles.element} alt="" />
            <span className={numberbgclass}>{(dayOfYear < 20 ? GetRank(year - 1) : GetRank(year))}</span>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{translator.t('moon')}s - {translator.t('year')} {year}</Modal.Title>
                </Modal.Header>
                <MoonConfig moons={moons} defaultsMoonDefinition={moonSequence} onClose={() => setShow(false)} onSave={(index, element, polarity, leapIndex) => {
                    dispatch.updateMoonSequence({
                        index: index,
                        element: element,
                        polarity: polarity,
                        leapIndex: leapIndex,
                    })
                }} />
            </Modal>
        </div>
    </div>
};

const MoonConfig: FunctionComponent<{ moons: any[], defaultsMoonDefinition: MoonSequenceDefinition, onSave: Function, onClose: Function }> = ({
                                                                                                                                                  onSave,
                                                                                                                                                  defaultsMoonDefinition,
                                                                                                                                                  onClose,
                                                                                                                                                  moons
                                                                                                                                              }) => {
    const [index, setIndex] = useState(defaultsMoonDefinition.index);
    const [polarity, setPolarity] = useState(defaultsMoonDefinition.polarity);
    const [element, setElement] = useState(defaultsMoonDefinition.element);
    const [leapIndex, setLeapIndex] = useState(defaultsMoonDefinition.leapIndex);
    const [errors, setError] = useState([]);

    return <>
        <Modal.Body>
            <div className={"moon-config d-flex flex-column justify-content-center"}>
                {errors.length > 0 && <Alert variant="danger" onClose={() => setError([])} dismissible>
                    <Alert.Heading>{translator.t('form.error.main')}</Alert.Heading>
                    <ul>
                        {errors.map((error, index) => {
                            return <li key={index}>{translator.t(error)}</li>
                        })}
                    </ul>
                </Alert>}
                <Form.Control as="select" custom value={index} onChange={(event) => {
                    setIndex(parseInt(event.target.value))
                }}>
                    <option disabled value={-1}>{translator.t('moon.select')}</option>
                    {moons.map((date, index) => {
                        return <option key={index} value={index}>{date.format("LL")} - {translator.t('moon')} #{index + 1}</option>
                    })}
                </Form.Control>
                <hr />
                <div className="button-group-container m-auto">
                    <ToggleButtonGroup type="radio" name="element" value={element} onChange={value => setElement(value)} className="buttons-group-options">
                        {elementSequenceOrder.map(value => {
                            return <ToggleButton key={value} variant="outline-dark" value={value}>{translator.t(value)}</ToggleButton>
                        })}
                    </ToggleButtonGroup>
                </div>
                <hr />
                <div className="button-group-container m-auto">
                    <ToggleButtonGroup type="radio" name="polarity" value={polarity} onChange={value => setPolarity(value)} className="buttons-group-options">
                        {polaritySequenceOrder.map(value => {
                            return <ToggleButton key={value} variant="outline-dark" value={value}>{value}</ToggleButton>
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
                            <Form.Control as="select" custom value={leapIndex} onChange={(event) => {
                                setLeapIndex(parseInt(event.target.value))
                            }}>
                                <option disabled value={-1}>{translator.t('leapmoon.select')}</option>
                                {moons.map((date, index) => {
                                    if (index === 0) {
                                        return;
                                    }
                                    return <option key={index} value={index}>{date.format("LL")} - {translator.t('moon')} #{index + 1}</option>
                                })}
                            </Form.Control>
                        </div>
                    </>
                )}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => onClose()}>{translator.t('close')}</Button>
            <Button variant="dark" onClick={() => {
                let errors = [];
                if (index === -1) {
                    errors.push('form.error.date');
                }
                if (element === '') {
                    errors.push('form.error.element');
                }
                if (polarity === '') {
                    errors.push('form.error.polarity');
                }

                if ((leapIndex === -1) && (moons.length > 12)) {
                    errors.push('form.error.leapmoon');
                }
                if (errors.length > 0) {
                    setError(errors);
                } else {
                    onSave(index, element, polarity, leapIndex)
                    onClose()
                }
            }}>Save changes</Button>
        </Modal.Footer>
    </>
};


export default GanzhiYear;
