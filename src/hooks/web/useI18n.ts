import i18n, { Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from 'locales/en.json';
import cnTranslation from 'locales/zh.json';

const resources: Resource = {
    en: {
        translation: enTranslation
    },
    cn: {
        translation: cnTranslation
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    keySeparator: '.',
    interpolation: {
        escapeValue: false,
        formatSeparator: ','
    }
});
export const t = (key: string, params: { [key: string]: any } = {}) => i18n.t(key, params);
export default i18n;
