import Translations from './Translations.js';
import {I18n} from "i18n-js";

export default class Locale extends MODULECLASS {
    constructor(parent) {
        super(parent);

        this.i18n = new I18n();

        Object.keys(Translations).forEach(locale => this.i18n.store({
            [locale]: Translations[locale]
        }));

        this.i18n.locale = 'de';

        // map it globally
        window._T = (text, options) => this.i18n.t(text, options);
        window._L = (to, value) => this.i18n.l(to, value);

    }

    setLocale(key) {
        this.i18n.locale = key;
    }
}
