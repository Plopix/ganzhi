import React, { FunctionComponent, useState } from 'react';
import { GetRank } from '../functions';
import { Periods } from '../periods';

import { ToggleButtonGroup, ToggleButton, Modal } from 'react-bootstrap';
import { useApp } from './App/Provider';
import moment from 'moment';
import { translator } from '../Translator';
import CelebrationDaysModal from './shared/CelebrationDaysModal';
import PeriodModal from './shared/PeriodModal';
import { Helmet } from 'react-helmet';

const Jiequi: FunctionComponent = () => {
    const [state] = useApp();
    const [value, setValue] = useState<string>('wen');
    const [periodVisible, setPeriodVisible] = useState<boolean>(false);
    const [celebrationVisible, setCelebrationVisible] = useState<boolean>(false);

    const rank: number = GetRank(state.isInNewYear ? state.year : state.year - 1);
    const startingPoint: number = state.isLeapYear ? 81 : 80;
    const angle: number = (state.dayOfYear - startingPoint) * (360 / (state.isLeapYear ? 366 : 365));
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

    const periodLines = Periods[translator.locale][index];

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

    const celebrationDay: number = celebrations.indexOf(state.dayOfYear) + 1;

    return (
        <div className="jiequi-container layer-container">
            <Helmet>
                <title>{translator.t('jieqi.title')} - Ganzhi App</title>
            </Helmet>
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
                    <PeriodModal lines={periodLines} />
                </Modal>
                <Modal show={celebrationVisible} onHide={() => setCelebrationVisible(false)} centered>
                    <CelebrationDaysModal celebrations={celebrations} setCelebrationVisible={setCelebrationVisible} />
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
