import * as MoonPhase from 'moonphase-js';
import * as moment from 'moment';

declare global {
    interface Number {
        realModulo: (b: number) => number;
    }
}

Number.prototype.realModulo = function (b: number): number {
    return ((this % b) + b) % b;
};

export const GetRank = (year: number): number => {
    let rank = (year - 3).realModulo(60);

    if (year <= 3) {
        rank += 60;
    }
    if (rank === 0) {
        rank = 60;
    }

    return rank;
};

export const YearCycleRange = (year: number, step: number): { min; max } => {
    const min = year - (year - 1984).realModulo(step);
    return { min, max: min + step - 1 };
};

export const RecalculateNewMoons = (year: number): moment.Moment[] => {
    const days = year % 4 === 0 ? 366 : 365;
    const moons = [];
    let last = null;
    for (let day = 0; day < days; day++) {
        const date = moment()
            .second(1)
            .hour(1)
            .minute(1)
            .dayOfYear(day + 1)
            .year(year);
        const mp = new MoonPhase(date.toDate());
        if ((mp.phase >= 0.98 || mp.phase < 0.09) && (date.diff(last, 'days') > 5 || last === null)) {
            last = date;
            moons.push(date);
        }
    }
    return moons;
};
