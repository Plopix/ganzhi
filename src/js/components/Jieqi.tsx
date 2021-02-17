import React, { FunctionComponent, useState } from 'react';
import { GetRank } from '../functions';
import { Periods } from '../periods';

import { ToggleButtonGroup, ToggleButton, Modal } from 'react-bootstrap';
import { useApp } from './App/Provider';
import moment from 'moment';
import { translator } from '../Translator';

const Jiequi: FunctionComponent = () => {
    const [state, dispatch] = useApp();
    const [value, setValue] = useState('wen');
    const [periodVisible, setPeriodVisible] = useState(false);
    const [celebrationVisible, setCelebrationVisible] = useState(false);

    const rank = GetRank(state.isInNewYear ? state.year : state.year - 1);
    const startingPoint = state.isLeapYear ? 81 : 80;
    const angle = (state.dayOfYear - startingPoint) * (360 / (state.isLeapYear ? 366 : 365));
    const styles = {
        arrow: {
            transform: 'rotate(' + angle + 'deg)'
        }
    };
    // Angle 0 is Period 18 (started by 0)
    let index = Math.floor(angle / (360 / 72));
    if (index < 0) {
        index = 72 + index;
    }
    index = (index + 18) % 72;

    const periods = Periods[translator.locale][index];

    // +0d apres la 2elune ON NEW YEAR OR if >50 then we fallback on first moon
    const newYear = state.moons[1].dayOfYear() > 50 ? state.moons[0] : state.moons[1];
    const celebrations = [
        newYear.dayOfYear(),
        newYear.clone().add(14, 'days').dayOfYear(), //+14d 2 apres la 2lune new year si 10 fevrier alors 24 pour le nouveau
        moment([state.year, 3, 4]).dayOfYear(), // 4 april
        moment([state.year, 3, 5]).dayOfYear(), // 5 april
        moment([state.year, 3, 6]).dayOfYear(), // 6 april
        state.moons[5].clone().add(4, 'days').dayOfYear(), // +4j apres la 6e lune
        state.moons[7].clone().add(6, 'days').dayOfYear(), // +6j apres la 8e lune
        state.moons[7].clone().add(14, 'days').dayOfYear(), // +14j apres la 8e lune
        state.moons[8].clone().add(14, 'days').dayOfYear(), // +14j apres la 9e lune
        state.moons[9].clone().add(8, 'days').dayOfYear(), //  +8j apres la 10e lune
        moment([state.year, 11, 21]).dayOfYear() // 21 decembre
    ];

    const celebrationDay = celebrations.indexOf(state.dayOfYear) + 1;

    return (
        <div className="jiequi-container layer-container">
            <h1>{translator.t('jieqi.title')}</h1>
            <div className="inner" onDoubleClick={() => setPeriodVisible(true)}>
                <img src="/images/jieqi/jieqi.png" alt="" />
                <img src={'/images/jieqi/bagua' + value + '.png'} alt="" />
                {celebrationDay > 0 && <img src="/images/jieqi/background.png" alt="" />}
                {celebrationDay > 0 && <img src="/images/jieqi/front-clouds.png" alt="" />}
                <img src={'/images/zodiac/zodiac-' + rank + '.png'} alt="" />
                {celebrationDay > 0 ? (
                    <img src="/images/jieqi/arrow-festival.png" style={styles.arrow} alt="" />
                ) : (
                    <img src="/images/jieqi/arrow.png" style={styles.arrow} alt="" />
                )}
                {celebrationDay > 0 && <img src={'/images/fetes/fete-' + celebrationDay + '.png'} alt="" />}
                <Modal show={periodVisible} onHide={() => setPeriodVisible(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{translator.t('solar.period')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul>
                            {periods.map((line, index) => (
                                <li key={index}>{line}</li>
                            ))}
                        </ul>
                    </Modal.Body>
                </Modal>
                <Modal show={celebrationVisible} onHide={() => setCelebrationVisible(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{translator.t('celebrations')}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ul className={'list-group'}>
                            {celebrations.map((celebrationDay, index) => {
                                const celebration = moment().year(state.year).dayOfYear(celebrationDay);
                                const [fr, ch, pin] = translator.t('celebration.' + index, 'celebrations').split('-');
                                const extraButtons = [];
                                if (index >= 2 && index <= 4) {
                                    if (index === 2) {
                                        extraButtons.push(
                                            <button
                                                key={index + 1}
                                                className={'btn btn-sm btn-danger mb-1'}
                                                onClick={() => {
                                                    dispatch.updateDayOfYear(celebrationDay + 1);
                                                    setCelebrationVisible(false);
                                                }}
                                            >
                                                {moment()
                                                    .year(state.year)
                                                    .dayOfYear(celebrationDay + 1)
                                                    .format('LL')}
                                            </button>
                                        );
                                        extraButtons.push(
                                            <button
                                                key={index + 2}
                                                className={'btn btn-sm btn-danger'}
                                                onClick={() => {
                                                    dispatch.updateDayOfYear(celebrationDay + 2);
                                                    setCelebrationVisible(false);
                                                }}
                                            >
                                                {moment()
                                                    .year(state.year)
                                                    .dayOfYear(celebrationDay + 2)
                                                    .format('LL')}
                                            </button>
                                        );
                                    }
                                    if (index > 2) {
                                        return null;
                                    }
                                }
                                return (
                                    <li
                                        key={index}
                                        className={'list-group-item d-flex flex-row justify-content-between'}
                                    >
                                        <div>
                                            {fr.trim()}
                                            <br />
                                            {ch.trim()} {pin.trim()}
                                        </div>
                                        <div className={'d-flex flex-column'}>
                                            <button
                                                className={'btn btn-sm btn-danger mb-1'}
                                                onClick={() => {
                                                    dispatch.updateDayOfYear(celebrationDay);
                                                    setCelebrationVisible(false);
                                                }}
                                            >
                                                {celebration.format('LL')}
                                            </button>
                                            {extraButtons.map((button) => button)}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </Modal.Body>
                </Modal>
            </div>
            <div className="button-group-container">
                <ToggleButtonGroup
                    type="radio"
                    name="bagua"
                    value={value}
                    onChange={(value) => setValue(value)}
                    className="buttons-group-options"
                >
                    <ToggleButton variant="outline-dark" value={'fuxi'}>
                        <span dangerouslySetInnerHTML={{ __html: translator.t('fuxi') }} />
                    </ToggleButton>
                    <ToggleButton variant="outline-dark" value={'wen'}>
                        <span dangerouslySetInnerHTML={{ __html: translator.t('wen') }} />
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <button
                className={'celebration-opener'}
                title={translator.t('celebrations')}
                onClick={() => {
                    if (periodVisible) {
                        return;
                    }
                    setCelebrationVisible(true);
                }}
            >
                <img src="/images/festivals.png" alt={translator.t('celebrations')} />
            </button>
        </div>
    );
};

export default Jiequi;
