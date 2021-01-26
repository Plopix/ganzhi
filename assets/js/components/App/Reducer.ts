import {recalculateNewMoons} from "../../functions";
import moment, {Moment} from "moment";
import {MoonSequenceDefinition, Page} from "./Type";

type Action =
    | { type: 'CHANGE_YEAR'; year: number }
    | { type: 'CHANGE_DAY'; dayOfYear: number }
    | { type: 'CHANGE_DATE'; date: Moment }
    | { type: 'CHANGE_PAGE'; page: Page }
    | { type: 'CHANGE_MOON_SEQUENCE'; sequence: MoonSequenceDefinition }

export type Actions = {
    updateDayOfYear: (day: number) => void;
    updateYear: (year: number) => void;
    updatePage: (page: string) => void;
    updateDate: (date: Moment) => void;
    updateMoonSequence: (sequence: MoonSequenceDefinition) => void;
};

export type State = {
    year: number;
    dayOfYear: number;
    moons: Moment[];
    page: Page;
    isLeapYear: boolean;
    moonSequence: MoonSequenceDefinition,
    isInNewYear: boolean,
};

export type Dispatch = (action: Action) => void;

export function Reducer(state: State, action: Action) {
    switch (action.type) {
        case 'CHANGE_YEAR': {
            const date = moment().dayOfYear(state.dayOfYear).year(action.year);
            const moons = recalculateNewMoons(action.year);
            return {
                ...state,
                year: action.year,
                isLeapYear: moment([action.year]).isLeapYear(),
                moons: moons,
                isInNewYear: date.isSameOrAfter(moons[1])
            };
        }
        case 'CHANGE_DAY': {
            const date = moment().year(state.year).dayOfYear(action.dayOfYear);
            return {
                ...state,
                dayOfYear: action.dayOfYear,
                isInNewYear: date.isSameOrAfter(state.moons[1])
            };
        }
        case 'CHANGE_PAGE': {
            return {
                ...state,
                page: action.page
            };
        }
        case 'CHANGE_DATE': {
            const moons = recalculateNewMoons(action.date.year());
            return {
                ...state,
                year: action.date.year(),
                isLeapYear: action.date.isLeapYear(),
                moons: moons,
                dayOfYear: action.date.dayOfYear(),
                isInNewYear: action.date.isSameOrAfter(moons[1])
            };
        }
        case 'CHANGE_MOON_SEQUENCE': {
            return {
                ...state,
                moonSequence: action.sequence
            };
        }
        default: {
            throw new Error('Unhandled action type');
        }
    }
}

export function mapToReducerActions(dispatch: Dispatch): Actions {
    return {
        updateDayOfYear: (dayOfYear: number) => dispatch({type: 'CHANGE_DAY', dayOfYear}),
        updateYear: (year: number) => dispatch({type: 'CHANGE_YEAR', year}),
        updatePage: (page: Page) => dispatch({type: 'CHANGE_PAGE', page}),
        updateDate: (date: Moment) => dispatch({type: 'CHANGE_DATE', date}),
        updateMoonSequence: (sequence: MoonSequenceDefinition) => dispatch({type: 'CHANGE_MOON_SEQUENCE', sequence}),
    };
}
