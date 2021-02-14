import React from 'react';
import {Page} from "./Type";
import Ganzhi from "../Ganzhi";
import GanzhiYear from "../GanzhiYear";
import Sources from "../Sources";
import Jieqi from "../Jieqi";
import {Redirect} from 'react-router-dom';
import Guide from '../Guide';
import Notes from '../Notes';

const Routes = [
    {
        path: '/',
        exact: true,
        main: () => <Redirect to={Page.GANZHI} />
    },
    {
        path: Page.GANZHI,
        exact: true,
        main: () => <Ganzhi />
    },
    {
        path: Page.GANZHIYEAR,
        exact: true,
        main: () => <GanzhiYear />
    },
    {
        path: Page.JIEQI,
        exact: true,
        main: () => <Jieqi />
    },
    {
        path: Page.SOURCES,
        exact: true,
        main: () => <Sources />
    },
    {
        path: Page.GUIDE,
        exact: true,
        main: () => <Guide />
    },
    {
        path: Page.NOTES,
        exact: true,
        main: () => <Notes />
    },
    {
        path: '*',
        main: () => <Redirect to={Page.GANZHI} />
    }
];

export default Routes;
