import React, { Suspense } from 'react';
import { Routes } from 'react-router';
import { IntlProvider } from 'react-intl';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { ThemeContext } from './config/themes';
import { LocaleContext } from './config/locales/index';
import config from './config';
import Loading from './pages/Loading/Loading'

//console.log(config);
//console.log(Object.keys(config.routes[0]));
//console.log(config.routes[0].type, config.routes[0].ref)
const App = () => {

  const [theme, setTheme] = React.useState({
    id: 'main',
    isDarkMode: true,
    toggleTheme: (id) => {
      //const shallowCopy = Object.assign({}, theme);
      //shallowCopy.id = id;
      setTheme(prevState => ({ ...prevState, id: id }));
    },
    toggleDarkMode: () => {
      //const shallowCopy = Object.assign({}, theme);
      //shallowCopy.isDarkMode = theme.isDarkMode === true ? false : true;
      setTheme(prevState => ({
        ...prevState, isDarkMode: prevState.isDarkMode === true ? false : true
      }));
    },
  })

  const _theme = React.useMemo(
    () => {
      //console.log('Creating a new theme for this fuckwit')
      if (theme.isDarkMode === true) {
        return createTheme(config.themes.main.dark);
      }
      return createTheme(config.themes.main.light);
    },
    [theme.isDarkMode],
  );

  //console.log('=====Just your friendly neighborhood stupid stuff checker=====')
  //console.log('theme');
  //console.log(theme);
  //console.log('possible themes');
  //console.log(config.themes);
  //console.log('==============================================================')

  const [locale, setLocale] = React.useState({
    lang: 'en',
    availibleLangs: Object.keys(config.locale.locales),
    toggleLocale: (lang) => {
      setLocale(prevState => ({ ...prevState, lang: lang }));
    },
  })

  const _locale = React.useMemo(
    () => {
      //console.log('Creating a new locale for this fuckwit')
      return config.locale.locales[locale.lang]
    },
    [locale.lang],
  );

  //addLocaleData(Object.values(config.locale.locales));

  // Here if I ever needed default detection. I personally hate this with passion on other sites
  // const prefLang = navigator.language.split(/[-_]/)[0];

  // Prolly better idea to move it all into separate file but I prefer having this as a container.
  // It's that way top level and all necesssary providers can get registered here.
  return (
    <ThemeContext.Provider value={theme} >
      <ThemeProvider theme={_theme}>
        <LocaleContext.Provider value={locale} >
          <IntlProvider
            // I am so sorry for this naming I will redo it at some point
            locale={locale.lang}
            defaultLocale="en"
            messages={_locale}
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
