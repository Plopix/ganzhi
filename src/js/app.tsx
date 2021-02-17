import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { translator } from './Translator';
import moment from 'moment';

const container = document.getElementById('ganzhi-app');

declare global {
    interface Number {
        realModulo: (b: number) => number;
    }
}

Number.prototype.realModulo = function (b: number): number {
    return ((this % b) + b) % b;
};

const browslerLocale = navigator.language.substr(0, 2);
translator.locale = browslerLocale === 'fr' ? 'fr' : 'en';
moment.locale(translator.locale);

if (container !== null) {
    ReactDOM.render(<App />, container);
}

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
            function (registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            },
            function (err) {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}
