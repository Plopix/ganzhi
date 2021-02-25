import React, { FunctionComponent, useState } from 'react';
import { GetRank } from '../functions';
import { Modal } from 'react-bootstrap';
import { useApp } from './App/Provider';
import { elementSequenceOrder, MoonSequenceDefinition, polaritySequenceOrder } from './App/Type';
import { translator } from '../Translator';
import JournalModal from './shared/Modals/JournalModal';
import { Moment } from 'moment';
import MoonConfigModal from './shared/Modals/MoonConfigModal';
import { Helmet } from 'react-helmet';

const GanzhiYear: FunctionComponent = () => {
    const [state, dispatch] = useApp();
    const [moonConfigVisible, setMoonConfigVisible] = useState<boolean>(false);
    const [journalVisible, setJournalVisible] = useState<boolean>(false);
    const countEnergy = 6;
    const countElement = 5;
    const isLeapYear: boolean = state.isLeapYear;
    const year: number = state.year;
    const dayOfYear: number = state.dayOfYear;
    const moons: Moment[] = state.moons;
    const moonSequence: MoonSequenceDefinition = state.moonSequence;

    const adjustedRankEnergy: number = dayOfYear < 20 ? GetRank(year - 1) : GetRank(year);
    const adjustedRankElement: number = dayOfYear < 36 ? GetRank(year - 1) : GetRank(year);
    const startingPoint: number = isLeapYear ? 81 : 80;
    const centerImage: string =
        year.realModulo(2) === 0 ? '/images/ganzhiyear/yangyear.png' : '/images/ganzhiyear/yinyear.png';
    const numberbgclass: string = year.realModulo(2) === 0 ? 'center-number white' : 'center-number black';

    const styles = {
        energy: {
            transform: 'rotate(' + adjustedRankEnergy * -(360 / countEnergy) + 'deg)'
        },
        element: {
            transform: 'rotate(' + adjustedRankElement * -(360 / countElement) + 'deg)'
        },
        arrow: {
            transform: 'rotate(' + (dayOfYear - startingPoint) * (360 / (isLeapYear ? 366 : 365)) + 'deg)'
        }
    };

    return (
        <div className="ganzhiyear-container layer-container">
            <Helmet>
                <title>{translator.t('ganzhiyear.title')} - Ganzhi App</title>
            </Helmet>
            <h1>{translator.t('ganzhiyear.title')}</h1>
            <div
                className="inner"
                onDoubleClick={() => {
                    if (journalVisible) {
                        return;
                    }
                    setMoonConfigVisible(true);
                }}
            >
                <img src="/images/ganzhiyear/arrow.png" style={styles.arrow} alt="" />
                <img src="/images/ganzhiyear/background.png" alt="" />
                <img src="/images/ganzhiyear/energy.png" style={styles.energy} alt="" />
                <img src="/images/ganzhiyear/element.png" style={styles.element} alt="" />
                <img src={'/images/ganzhiyear/arrows/arrow-' + adjustedRankEnergy + '.png'} alt="" />

                {moons.map((date, wIndex) => {
                    const index = wIndex - moonSequence.index;
                    const style = {
                        transform:
                            'rotate(' +
                            (90 + date.dayOfYear() - startingPoint) * (360 / (isLeapYear ? 366 : 365)) +
                            'deg)'
                    };
                    if (moonSequence.index === -1) {
                        return <img key={'moon' + index} src="/images/moons/default.png" style={style} alt="" />;
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

                    return (
                        <img
                            key={'moon' + index}
                            src={'/images/moons/' + element + '-' + polarity + '.png'}
                            style={style}
                            alt=""
                        />
                    );
                })}

                <img src={centerImage} className="element" style={styles.element} alt="" />
                <span className={numberbgclass}>{dayOfYear < 20 ? GetRank(year - 1) : GetRank(year)}</span>

                <Modal show={moonConfigVisible} onHide={() => setMoonConfigVisible(false)} centered>
                    <MoonConfigModal
                        year={year}
                        moons={moons}
                        defaultsMoonDefinition={moonSequence}
                        onClose={() => setMoonConfigVisible(false)}
                        onSave={(index, element, polarity, leapIndex) => {
                            dispatch.updateMoonSequence({
                                index: index,
                                element: element,
                                polarity: polarity,
                                leapIndex: leapIndex
                            });
                        }}
                    />
                </Modal>

                <Modal show={journalVisible} onHide={() => setJournalVisible(false)} centered>
                    <JournalModal onClose={() => setJournalVisible(false)} />
                </Modal>
            </div>
            <button
                className={'journal-opener'}
                title={'Journal' + state.year}
                onClick={() => {
                    if (moonConfigVisible) {
                        return;
                    }
                    setJournalVisible(true);
                }}
            >
                <img src="/images/notes.png" alt="Journal" />
            </button>
        </div>
    );
};

export default GanzhiYear;
