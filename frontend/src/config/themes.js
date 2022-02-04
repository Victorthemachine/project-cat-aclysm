import red from '@mui/material/colors/red'
import green from '@mui/material/colors/green'
import pink from '@mui/material/colors/pink'

const themes = [
  {
    id: 'light',
    color: '#7a55c7',
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
    id: 'dark',
    color: '#7999d3',
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
  {
    id: 'red',
    color: red[500],
    source: {
      palette: {
        primary: red,
        secondary: pink,
        error: red,
      },
    },
  },
  {
    id: 'green',
    color: green[500],
    source: {
      palette: {
        primary: green,
        secondary: red,
        error: red,
      },
    },
  },
]

export default themes
