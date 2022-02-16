import React, { Suspense } from 'react';
import { Routes } from 'react-router';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from '@mui/material/styles';

import { ThemeContext } from './config/themes';
import { LocaleContext } from './config/locales/index';
import config from './config';
import Loading from './pages/Loading/Loading'
// FIX: Theme must be defined with index!!!
console.log(config);
console.log(Object.keys(config.routes[0]));
console.log(config.routes[0].type, config.routes[0].ref)
const App = () => {

  const [theme, setTheme] = React.useState({
    id: 'main',
    isDarkMode: false,
    toggleTheme: (id) => {
      setTheme({ id: id });
    },
    toggleDarkMode: () => {
      setTheme({ isDarkMode: theme.isDarkMode === true ? false : true })
    },
  })

  const [locale, setLocale] = React.useState({
    lang: 'en',
    toggleLocale: (lang) => {
      setLocale({ lang: lang });
    },
  })

  //addLocaleData(Object.values(config.locale.locales));

  // Here if I ever needed default detection. I personally hate this with passion on other sites
  // const prefLang = navigator.language.split(/[-_]/)[0];

  // Prolly better idea to move it all into separate file but I prefer having this as a container.
  // It's that way top level and all necesssary providers can get registered here.
  return (
    <ThemeContext.Provider value={theme} >
      <ThemeProvider theme={config.themes[theme.id][theme.isDarkMode === true ? 'dark' : 'light']}>
        <LocaleContext.Provider value={locale} >
          <IntlProvider
            // I am so sorry for this naming I will redo it at some point
            locale={locale.lang}
            defaultLocale="en"
            messages={config.locale.locales[locale.lang]}
          >
            <Suspense fallback={<Loading />}>
              <Routes>
                {config.routes}
              </Routes>
            </Suspense>
          </IntlProvider>
        </LocaleContext.Provider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;
