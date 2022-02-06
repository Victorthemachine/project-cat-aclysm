const themes = [
    {
        id: 'default_light',
        source: {
            palette: {
                type: 'light',
                primary: {
                    main: '#7a55c7',
                    contrastText: '#f0efec'
                },
                secondary: {
                    main: '#8a8da1',
                },
                background: {
                    default: '#f0efec',
                    paper: '#f0efec',
                },
                text: {
                    primary: '#8a8da1',
                    secondary: '#8a8da1'
                },
            }
        }
    },
    {
        id: 'default_dark',
        source: {
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
                    default: '#121212',
                    paper: '#121212',
                },
                text: {
                    primary: '#fff',
                    secondary: 'rgba(255, 255, 255, 0.7)'
                },
            }
        }
    },
];

export default themes;