const MoonPhase = require('moonphase-js');
import moment, {Moment} from "moment";

export const GetRank = (year: number): number => {

    let rank = (year - 3).realModulo(60);

    if (year <= 3) {
        rank += 60;
    }
    if (rank === 0) {
        rank = 60;
    }

    return rank;

}

export const YearCycleRange = (year: number, step: number): { min, max } => {
    const min = year - (year - 1984).realModulo(60);
    return {min, max: min + step-1}
}

export const recalculateNewMoons = (year: number): Moment[] => {
    const days = (year % 4) === 0 ? 366 : 365;
    let moons = [];
    let last = null;
    for (let day = 0; day < days; day++) {
        const date = moment()
            .second(1)
            .hour(1)
            .minute(1)
            .dayOfYear(day + 1)
            .year(year)
        const moonphase = new MoonPhase(date.toDate());
        if ((moonphase.phase > 0 && moonphase.phase < 0.09) && ((date.diff(last, 'days') > 5) || last === null)) {
            last = date;
            moons.push(date);
        }
    }
    return moons;
}
