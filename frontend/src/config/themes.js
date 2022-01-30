import red from '@mui/material/colors/red'
import green from '@mui/material/colors/green'
import pink from '@mui/material/colors/pink'

const themes = [
  {
    id: 'default',
    color: '#7a55c7',
    source: {
      palette: {
        mode: 'light',
        primary: {
          light: '#7999d3',
          main: '#7a55c7',
          dark: '#7a55c7',
        },
        secondary: {
          main: '#7a55c7',
        },
        background: {
          default: '#f0efec',
          paper: '#f0efec',
        },
        text: {
          primary: '#8a8da1'
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
