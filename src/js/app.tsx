import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { translator } from './Translator';
import moment from 'moment';

const container = document.getElementById('ganzhi-app');

declare let __TRANSLATIONS__: any;

const browslerLocale = navigator.language.substr(0, 2);
translator.locale = browslerLocale === 'fr' ? 'fr' : 'en';
translator.catalog = __TRANSLATIONS__;
moment.locale(translator.locale);

if (container !== null) {
    ReactDOM.render(<App />, container);
}

// We don't want peope to be confused with serviceWorker in dev mode
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
