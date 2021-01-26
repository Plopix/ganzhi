import * as React from 'react';
import {FunctionComponent} from 'react';
import {
    Actions,
    Dispatch,
    mapToReducerActions,
    Reducer,
    State
} from './Reducer';
import moment from "moment";
import {recalculateNewMoons} from "../../functions";
import {Page} from "./Type";

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initialState = (): State => {
    const moons = recalculateNewMoons(moment().year());
    return {
        year: moment().year(),
        isLeapYear: moment().year() % 4 === 0,
        dayOfYear: moment().dayOfYear(),
        moons: moons,
        page: Page.GANZHI,
        moonSequence: {
            index: -1,
            element: '',
            polarity: '',
            leapIndex: -1,
        },
        isInNewYear: moment().isSameOrAfter(moons[1])
    };
};

const Provider: FunctionComponent<{ children }> = ({children}) => {
    const [state, dispatch] = React.useReducer(Reducer, initialState());
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};

function useState() {
    const context = React.useContext(StateContext);
    if (context === undefined) {
        throw new Error('useState must be used within the App.');
    }
    return context;
}

function useDispatch() {
    const context = React.useContext(DispatchContext);
    if (context === undefined) {
        throw new Error('useDispatch must be used within the App.');
    }
    return context;
}

function useApp(): [State, Actions] {
    const actions = mapToReducerActions(useDispatch());
    return [useState(), actions];
}

export {Provider, useApp};
