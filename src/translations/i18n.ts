import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import lt from './locales/lt';
const resources = {
    en: en,
    lt: lt,
};
i18n
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        lng: 'lt',
        fallbackLng: 'en',
        debug: true,
        resources,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    });
export default i18n;
