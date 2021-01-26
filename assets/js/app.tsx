import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/App/App";

const container = document.getElementById('ganzhi-app');

declare global {
    interface Number {
        realModulo: (b: Number) => number;
    }
}

Number.prototype.realModulo = function(b: number): number {
    return ((this % b) + b) % b;
};

ReactDOM.render(<App/>, container);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
