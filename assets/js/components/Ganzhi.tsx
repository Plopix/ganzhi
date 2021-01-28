import React, {FunctionComponent, useState} from 'react';
import {GetRank} from '../functions';

import {
    ToggleButtonGroup,
    ToggleButton
} from 'react-bootstrap';
import {useApp} from "./App/Provider";
import {translator} from "../Translator";

const Ganzhi: FunctionComponent = () => {
    const [state] = useApp();
    const [value, setValue] = useState([]);
    const rank = GetRank(state.isInNewYear ? state.year : state.year - 1);
    const diff = state.year - 4;
    const cycle = Math.floor(diff / 10).realModulo(6);
    const countGanZangfu = 6;
    const countYear = 12;
    const firstEmpty = 12 - (2 * (1 + cycle));
    const startNumberPosition = (firstEmpty + 2).realModulo(12);

    const styles = {
        gan: {
            transform: "rotate(" + (cycle * -(360 / countGanZangfu)) + "deg)"
        },
        zangfu: {
            transform: "rotate(" + (cycle * -(360 / countGanZangfu)) + "deg)"
        },
        arrow: {
            transform: "rotate(" + ((diff % 12) * (360 / countYear)) + "deg)"
        }
    };

    let bubles = [];
    const startCount = (cycle * 10) + 1;
    for (let i = 0; i < 12; i++) {
        bubles.push(startCount + i);
    }

    const handleChange = val => setValue(val);

    return <div className="ganzhi-container layer-container">
        <h1>{translator.t('ganzhi.title')}</h1>
        <div className="inner">
            <img src="/images/ganzhi/arrow.png" style={styles.arrow} alt="" />
            <img src="/images/ganzhi/background.png" alt="" />
            <img src="/images/ganzhi/gan.png" style={styles.gan} alt="" />

            {value.includes("servants") && <img src="/images/ganzhi/servants.png" alt="" />}
            {value.includes("hours") && <img src="/images/ganzhi/hours.png" alt="" />}
            {value.includes("zangfu") && <img src="/images/ganzhi/zangfu.png" style={styles.zangfu} alt="" />}
            <img src={"/images/zodiac/zodiac-" + rank + ".png"} />
            {bubles.map((value, index) => {
                const indexPosition = (index + startNumberPosition).realModulo(12);
                let computedValue = value;
                if (indexPosition === firstEmpty || indexPosition === firstEmpty + 1) {
                    computedValue = '';
                }
                return <span key={index} className={"position position-" + indexPosition}>{computedValue}</span>;
            })}
        </div>
        <div className="button-group-container">
            <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange} className="buttons-group-options">
                <ToggleButton variant="outline-dark" value={"servants"}>{translator.t('servants')}</ToggleButton>
                <ToggleButton variant="outline-dark" value={"hours"}>{translator.t('meridians')}</ToggleButton>
                <ToggleButton variant="outline-dark" value={"zangfu"}>{translator.t('zangfu')}</ToggleButton>
            </ToggleButtonGroup>
        </div>
    </div>
};

export default Ganzhi;
