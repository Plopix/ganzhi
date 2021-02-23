import React from 'react';
import { Page } from './Type';
import Ganzhi from '../Ganzhi';
import GanzhiYear from '../GanzhiYear';
import Jieqi from '../Jieqi';
import { Redirect } from 'react-router-dom';
import SimplePage from '../SimplePage';

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
        main: () => <SimplePage page={'thankyou'} />
    },
    {
        path: Page.GUIDE,
        exact: true,
        main: () => <SimplePage page={'guide'} />
    },
    {
        path: Page.NOTES,
        exact: true,
        main: () => <SimplePage page={'notes'} />
    },
    {
        path: '*',
        main: () => <Redirect to={Page.GANZHI} />
    }
];

export default Routes;
