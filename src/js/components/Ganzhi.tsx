import React, { FunctionComponent, useState } from 'react';
import { GetRank } from '../functions';

import { ToggleButtonGroup, ToggleButton, Modal } from 'react-bootstrap';
import { useApp } from './App/Provider';
import { translator } from '../Translator';
import { Helmet } from 'react-helmet';
import GanzhiSymbolsModal from './shared/Modals/GhanziSymbolsModal';
import GhanziSymbolsYinYangModal from './shared/Modals/GhanziSymbolsYiniYangModal';
import ResponsiveImage from './shared/ResponsiveImage';

const Ganzhi: FunctionComponent = () => {
    const [state] = useApp();
    const [value, setValue] = useState([]);
    const [symbolsVisible, setSymbolsVisible] = useState<boolean>(false);
    const [symbolsYinYang, setSymbolsYinYang] = useState<boolean>(false);

    const rank: number = GetRank(state.isInNewYear ? state.year : state.year - 1);
    const diff: number = state.year - 4;
    const cycle: number = Math.floor(diff / 10).realModulo(6);
    const countGanZangfu = 6;
    const countYear = 12;
    const firstEmpty: number = 12 - 2 * (1 + cycle);
    const startNumberPosition: number = (firstEmpty + 2).realModulo(12);

    const styles = {
        gan: {
            transform: 'rotate(' + cycle * -(360 / countGanZangfu) + 'deg)'
        },
        zangfu: {
            transform: 'rotate(' + cycle * -(360 / countGanZangfu) + 'deg)'
        },
        arrow: {
            transform: 'rotate(' + (diff % 12) * (360 / countYear) + 'deg)'
        }
    };

    const bubles: number[] = [];
    const startCount: number = cycle * 10 + 1;
    for (let i = 0; i < 12; i++) {
        bubles.push(startCount + i);
    }

    const handleChange = (val) => setValue(val);

    return (
        <div className="ganzhi-container layer-container">
            <Helmet>
                <title>{translator.t('ganzhi.title')} - Ganzhi App</title>
            </Helmet>
            <h1>{translator.t('ganzhi.title')}</h1>
            <div
                className="inner"
                onDoubleClick={() => {
                    if (symbolsYinYang) {
                        return;
                    }
                    setSymbolsVisible(true);
                }}
            >
                <ResponsiveImage src="/images/ganzhi/arrow.png" style={styles.arrow} />
                <ResponsiveImage src="/images/ganzhi/background.png" />
                <ResponsiveImage src="/images/ganzhi/gan.png" style={styles.gan} />

                {value.includes('servants') && <ResponsiveImage src="/images/ganzhi/servants.png" />}
                {value.includes('hours') && <ResponsiveImage src="/images/ganzhi/hours.png" />}
                {value.includes('zangfu') && <ResponsiveImage src="/images/ganzhi/zangfu.png" style={styles.zangfu} />}
                <ResponsiveImage src={'/images/zodiac/zodiac-' + rank + '.png'} />
                {bubles.map((value, index) => {
                    const indexPosition = (index + startNumberPosition).realModulo(12);
                    let computedValue = value;
                    if (indexPosition === firstEmpty || indexPosition === firstEmpty + 1) {
                        computedValue = 0;
                    }
                    return (
                        <span key={index} className={'position position-' + indexPosition}>
                            {computedValue === 0 ? '' : computedValue}
                        </span>
                    );
                })}
                <Modal show={symbolsVisible} onHide={() => setSymbolsVisible(false)} centered>
                    <GanzhiSymbolsModal />
                </Modal>
                <Modal show={symbolsYinYang} onHide={() => setSymbolsYinYang(false)} centered>
                    <GhanziSymbolsYinYangModal />
                </Modal>
            </div>
            <div className="button-group-container">
                <ToggleButtonGroup
                    type="checkbox"
                    value={value}
                    onChange={handleChange}
                    className="buttons-group-options"
                >
                    <ToggleButton variant="outline-dark" value={'servants'}>
                        {translator.t('servants')}
                    </ToggleButton>
                    <ToggleButton variant="outline-dark" value={'hours'}>
                        {translator.t('meridians')}
                    </ToggleButton>
                    <ToggleButton variant="outline-dark" value={'zangfu'}>
                        {translator.t('zangfu')}
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            <button
                className={'symbols-opener'}
                title={translator.t('symbol')}
                onClick={() => {
                    if (symbolsVisible) {
                        return;
                    }
                    setSymbolsYinYang(true);
                }}
            >
                <img src="/images/yinyang.png" alt={translator.t('symbl')} />
            </button>
        </div>
    );
};

export default Ganzhi;
