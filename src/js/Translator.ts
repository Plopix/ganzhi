declare let __TRANSLATIONS__: any;

class Translator {
    #locale: string;

    set locale(locale: string) {
        this.#locale = locale;
    }

    get locale(): string {
        return this.#locale;
    }

    translate(key: string, domain = 'messages', locale?: string) {
        const langOrThis = locale === null ? this.#locale : locale;
        const langOrEn = locale === null ? 'en' : locale;
        const fallback = domain + '-' + key;
        if (__TRANSLATIONS__[langOrThis] === undefined) {
            return fallback;
        }
        if (__TRANSLATIONS__[langOrThis][domain] === undefined) {
            return fallback;
        }
        return __TRANSLATIONS__[langOrThis][domain][key] || __TRANSLATIONS__[langOrEn][domain][key] || fallback;
    }

    t = (key: string, domain?: string, locale: string = null) => this.translate(key, domain, locale);
}

export const translator = new Translator();
