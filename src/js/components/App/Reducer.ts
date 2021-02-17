import { recalculateNewMoons } from "../../functions";
import moment, { Moment } from "moment";
import { elementSequenceOrder, Journal, MoonSequenceDefinition } from "./Type";

type Action =
    | { type: 'CHANGE_YEAR'; year: number }
    | { type: 'CHANGE_DAY'; dayOfYear: number }
    | { type: 'CHANGE_DATE'; date: Moment }
    | { type: 'CHANGE_MOON_SEQUENCE'; sequence: MoonSequenceDefinition }
    | { type: 'SAVE_NOTE'; text: string }

export type Actions = {
    updateDayOfYear: (day: number) => void;
    updateYear: (year: number) => void;
    updateDate: (date: Moment) => void;
    updateMoonSequence: (sequence: MoonSequenceDefinition) => void;
    saveNote: (text: string) => void;
};

export type State = {
    year: number;
    dayOfYear: number;
    moons: Moment[];
    isLeapYear: boolean;
    moonSequence: MoonSequenceDefinition,
    isInNewYear: boolean,
    journal: Journal
};

export type Dispatch = (action: Action) => void;

export function Reducer(state: State, action: Action) {
    switch (action.type) {
        case 'CHANGE_DATE':
        case 'CHANGE_YEAR': {
            const newYear = action.type === 'CHANGE_DATE' ? action.date.year() : action.year;
            const date = action.type === 'CHANGE_DATE' ? action.date : moment().year(action.year).dayOfYear(state.dayOfYear);
            const moons = recalculateNewMoons(newYear);
            const diff = newYear - state.year;
            const currentElementIndex = elementSequenceOrder.indexOf(state.moonSequence.element);
            const newElement = elementSequenceOrder[(currentElementIndex + (diff * 2)).realModulo(5)];

            const moonLimit = moons[1].dayOfYear() > 50 ? moons[0] : moons[1];

            return {
                ...state,
                year: newYear,
                isLeapYear: moment([newYear]).isLeapYear(),
                moons: moons,
                dayOfYear: date.dayOfYear(),
                isInNewYear: date.isSameOrAfter(moonLimit),
                moonSequence: {
                    ...state.moonSequence,
                    leapIndex: -1,
                    element: newElement
                }
            };
        }
        case 'CHANGE_DAY': {
            const date = moment().year(state.year).dayOfYear(action.dayOfYear);
            const moonLimit = state.moons[1].dayOfYear() > 50 ? state.moons[0] : state.moons[1];
            return {
                ...state,
                dayOfYear: action.dayOfYear,
                isInNewYear: date.isSameOrAfter(moonLimit),
            };
        }
        case 'CHANGE_MOON_SEQUENCE': {
            return {
                ...state,
                moonSequence: action.sequence
            };
        }
        case 'SAVE_NOTE': {
            return {
                ...state,
                journal: {
                    ...state.journal,
                    [state.year]: action.text
                }
            };
        }
        default: {
            throw new Error('Unhandled action type');
        }
    }
}

export function mapToReducerActions(dispatch: Dispatch): Actions {
    return {
        updateDayOfYear: (dayOfYear: number) => dispatch({ type: 'CHANGE_DAY', dayOfYear }),
        updateYear: (year: number) => dispatch({ type: 'CHANGE_YEAR', year }),
        updateDate: (date: Moment) => dispatch({ type: 'CHANGE_DATE', date }),
        updateMoonSequence: (sequence: MoonSequenceDefinition) => dispatch({ type: 'CHANGE_MOON_SEQUENCE', sequence }),
        saveNote: (text: string) => dispatch({ type: 'SAVE_NOTE', text })
    }
}
