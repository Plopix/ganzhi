class Translator {
    #locale: string;
    #catalog: any;

    set locale(locale: string) {
        this.#locale = locale;
    }

    get locale(): string {
        return this.#locale;
    }

    set catalog(catalog: any) {
        this.#catalog = catalog;
    }

    translate(key: string, domain = 'messages', locale?: string) {
        const langOrThis = locale === null ? this.#locale : locale;
        const langOrEn = locale === null ? 'en' : locale;
        const fallback = domain + '-' + key;
        if (this.#catalog[langOrThis] === undefined) {
            return fallback;
        }
        if (this.#catalog[langOrThis][domain] === undefined) {
            return fallback;
        }
        return this.#catalog[langOrThis][domain][key] || this.#catalog[langOrEn][domain][key] || fallback;
    }

    t = (key: string, domain?: string, locale: string = null) => this.translate(key, domain, locale);
}

export const translator = new Translator();
