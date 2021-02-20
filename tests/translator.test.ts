import { expect } from 'chai';
import { translator } from '../src/js/Translator';

translator.catalog = {
    en: {
        messages: {
            key1: 'Hello Key 1',
            key2: 'Hello Key 2'
        },
        forms: {
            plop: 'Plop Forms'
        }
    },
    fr: {
        messages: {
            key1: 'Bonjour Key 1',
            key2: 'Bonjour Key 2'
        },
        forms: {
            plop: 'Plop Formulaires'
        }
    }
};

describe('Translator', function () {
    describe('Set Locale', function () {
        it('should return the correctly set locale', function () {
            translator.locale = 'fr';
            expect(translator.locale).to.be.equal('fr');
            translator.locale = 'en';
        });
    });
    describe('Get Locale', function () {
        it('should return the last locale', function () {
            expect(translator.locale).to.be.equal('en');
        });
    });

    describe('Translation in en', function () {
        it('with no domain should return the good translation in English', function () {
            expect(translator.t('key1')).to.be.equal('Hello Key 1');
            expect(translator.t('key2')).to.be.equal('Hello Key 2');
        });
        it('with domain should return the good translation in English', function () {
            expect(translator.t('key1', 'messages')).to.be.equal('Hello Key 1');
            expect(translator.t('key2', 'messages')).to.be.equal('Hello Key 2');
            expect(translator.t('plop', 'forms')).to.be.equal('Plop Forms');
        });
    });
    describe('Translation in fr', function () {
        it('with no domain should return the good translation in French', function () {
            translator.locale = 'fr';
            expect(translator.t('key1')).to.be.equal('Bonjour Key 1');
            expect(translator.t('key2')).to.be.equal('Bonjour Key 2');
        });
        it('with domain should return the good translation in French', function () {
            translator.locale = 'fr';
            expect(translator.t('key1', 'messages')).to.be.equal('Bonjour Key 1');
            expect(translator.t('key2', 'messages')).to.be.equal('Bonjour Key 2');
            expect(translator.t('plop', 'forms')).to.be.equal('Plop Formulaires');
        });

        it('with domain should return the good forced translation in French', function () {
            translator.locale = 'en';
            expect(translator.t('key1', 'messages')).to.be.equal('Hello Key 1');
            expect(translator.t('key1', 'messages', 'fr')).to.be.equal('Bonjour Key 1');
            expect(translator.t('key2', 'messages', 'fr')).to.be.equal('Bonjour Key 2');
            expect(translator.t('plop', 'forms', 'fr')).to.be.equal('Plop Formulaires');
        });
    });

    describe('Default values', function () {
        it('should return domain-key', function () {
            expect(translator.t('key')).to.be.equal('messages-key');
            expect(translator.t('key', 'plop')).to.be.equal('plop-key');
        });
    });
});
