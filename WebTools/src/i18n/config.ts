import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

// we're creating a custom detector because we want it to default to
// a region-less version of the locale if the region-specific version
// is not supported.
const staDetector = {
    name: 'staDetector',

    lookup(options) {

        const localeAndRegionlessLocale = (locale) => {
            if (locale.indexOf('-') >= 0) {
                return  [locale, locale.substring(0, locale.indexOf('-'))];
            } else {
                return [ locale ];
            }
        }

        const found = [];

        if (typeof navigator !== 'undefined') {
            if (navigator.languages) { // chrome only; not an array, so can't use .push.apply instead of iterating
                for (let i = 0; i < navigator.languages.length; i++) {
                    localeAndRegionlessLocale(navigator.languages[i]).forEach(l =>
                        found.push(l)
                    );
                }
            }
            if (navigator['userLanguage']) {
                localeAndRegionlessLocale(navigator['userLanguage']).forEach(l =>
                    found.push(l)
                );
            }
            if (navigator.language) {
                localeAndRegionlessLocale(navigator.language).forEach(l =>
                    found.push(l)
                );
            }
        }

        return found.length > 0 ? found : undefined;
    }
};

const localStorageKey = 'settings.language';
const supportedLanguages = ['en', 'es', 'de', 'fr'];

const languageDetector = new LanguageDetector();
languageDetector.addDetector(staDetector);

export const getNavigatorLanguage = () => {
    let found = staDetector.lookup({})?.filter(l => supportedLanguages.indexOf(l) >= 0);
    return found?.length ? found[0] : "en";
}

export const isEnglishDefault = () => {
    let language = getNavigatorLanguage();
    return language.indexOf('en') === 0;
}

export const overrideLanguage = (language: string) => {
    if (supportedLanguages.indexOf(language) >= 0) {
        window.localStorage.setItem(localStorageKey, language);
        i18n.changeLanguage(language);
    }
}

export const clearLanguageOverride = () => {
    window.localStorage.removeItem(localStorageKey);
    i18n.changeLanguage();
}


export const isLanguageOverridePresent = () => {
    let value = window.localStorage.getItem(localStorageKey);
    return value === 'en';
}


i18n.use(initReactI18next)
    .use(resourcesToBackend((language, namespace) => import(`./locales/${language}/${namespace}.json`)))
    .use(languageDetector)
    .init({
        fallbackLng: 'en',
        supportedLngs: supportedLanguages,
        detection: {
            order: ['localStorage', "staDetector"],
            lookupLocalStorage: localStorageKey
        },
        ns: ['translations'],
        defaultNS: 'translations',
        debug: false,
        react: {
            useSuspense: false
        }
    });

i18n.on('languageChanged', (lng) => {
    document.documentElement.setAttribute('lang', lng);
});

export default i18n;
