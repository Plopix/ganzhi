import React, {FunctionComponent} from 'react';
import {GetRank} from '../functions';

const GanzhiYear: FunctionComponent<{ year: number, dayOfYear: number, isLeapYear: boolean }> = ({year, dayOfYear, isLeapYear}) => {
    const rank = GetRank(year);
    const countEnergy = 6;
    const countElement = 5;
    const startingPoint = isLeapYear ? 81 : 80;
    const centerImage = year.realModulo(2) === 0 ? "/images/ganzhiyear/yangyear.png" : "/images/ganzhiyear/yinyear.png";
    const numberbgclass = year.realModulo(2) === 0 ? "center-number white" : "center-number black";

    const styles = {
        energy: {
            transform: "rotate(" + (rank * -(360 / countEnergy)) + "deg)"
        },
        element: {
            transform: "rotate(" + (rank * -(360 / countElement)) + "deg)"
        },
        arrow: {
            transform: "rotate(" + (dayOfYear - startingPoint) * (360 / (isLeapYear ? 366 : 365)) + "deg)"
        }
    };

    return <div className="ganzhiyear-container layer-container">
        <h1>Gan and Zhi for year <span className="year">{year}</span></h1>
        <div className="inner">
            <img src="/images/ganzhiyear/arrow.png" style={styles.arrow} alt=""/>
            <img src="/images/ganzhiyear/background.png" alt=""/>
            <img src="/images/ganzhiyear/energy.png" style={styles.energy} alt=""/>
            <img src="/images/ganzhiyear/element.png" style={styles.element} alt=""/>
            <img src={centerImage} className="element" style={styles.element} alt=""/>
            <span className={numberbgclass}>{rank}</span>
        </div>
    </div>
};

export default GanzhiYear;
