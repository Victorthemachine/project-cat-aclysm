import themes from './themes';
import { locales } from './locales/index';
import routes from './routes';
import { Route } from 'react-router';

//console.log(routes[0].path, routes[0].exact, routes[0].component);
const config = {
    locale: {
        locales,
        defaultLocale: 'en',
    },
    themes,
    routes: routes.map(el => <Route path={el.path} exact={el.exact} element={el.component} />),
};

export default config;