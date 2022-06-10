import React from 'react';
//import { createTheme } from '@mui/material/styles';

const themes = {
    main: {
        light: {
            palette: {
                type: 'light',
                primary: {
                    main: '#7a55c7',
                    light: '#7999d3',
                    contrastText: '#f0efec'
                },
                secondary: {
                    main: '#8a8da1',
                    contrastText: '#121212'                    
                },
                background: {
                    default: '#fcfcfc',
                    paper: '#f0efec',
                },
                text: {
                    primary: '#8a8da1',
                    secondary: '#8a8da1'
                },
            }
        },
        dark: {
            palette: {
                type: 'dark',
                primary: {
                    main: '#7a55c7',
                    contrastText: '#f0efec'
                },
                secondary: {
                    main: '#7999d3',
                },
                background: {
                    default: '#404040',
                    paper: '#282828',
                },
                text: {
                    primary: '#fff',
                    secondary: 'rgba(255, 255, 255, 0.7)'
                },
            }
        }
    },
};

export const ThemeContext = React.createContext({
    id: 'default',
    isDarkMode: true,
    toggleTheme: () => {},
    toggleDarkMode: () => {}
});

export default themes;