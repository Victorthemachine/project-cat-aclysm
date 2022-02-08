import themes from './themes';
import locales from './locales';

const config = {
    locale: {
        locales,
        defaultLocale: parseLanguages(['en', 'de', 'ru'], 'en'),
        onError: (e) => {
            // Here we warn the user about translation error
            //console.warn(e)
            return
        },
    },
    theme: {
        themes,
        defaultThemeId: 'default_light',
        defaultInvertedThemeId: 'default_dark',
        defaultIsDarkMode: false,
    },
};

export default config;