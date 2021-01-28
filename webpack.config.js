var Encore = require('@symfony/webpack-encore');
const glob = require('glob-all');
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/js/app.tsx')
    .enableTypeScriptLoader()
    .enableForkedTypeScriptTypesChecking()
    .splitEntryChunks()
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .configureBabel(() => {}, {
        useBuiltIns: 'usage',
        corejs: 3
    })
    .enableSassLoader()
    .enableReactPreset()
    .configureDefinePlugin((options) => {
        let translations = {};
        glob.sync([
            path.join(__dirname, 'translations/**/*.yaml'),
        ]).forEach((file) => {
            const [domain, locale, ext] = path.basename(file).split('.');

            if (translations[locale] === undefined) {
                translations[locale] = {};
            }
            if (translations[locale][domain] === undefined) {
                translations[locale][domain] = {};
            }
            translations[locale][domain] = yaml.load(fs.readFileSync(file, 'utf8'));
        });
        options.__TRANSLATIONS__ = JSON.stringify(translations);
    })
;

module.exports = Encore.getWebpackConfig();
