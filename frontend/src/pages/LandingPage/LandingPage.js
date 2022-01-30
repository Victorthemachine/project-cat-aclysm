import React from 'react'
import { useTheme, ThemeProvider } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import CustomPaper from '../../components/CustomPaper'

// I have no idea what is wrong here, find out how to access the theme
const LandingPage = () => {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <CustomPaper>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'row',
          }}>
            <Button variant="contained" component={Link} to="https://discord.com/api/oauth2/authorize?client_id=775667315706560533&permissions=8&scope=bot">Invite me!</Button>
            <Button variant="contained" component={Link} to="/home">Dashboard</Button>
          </div>
        </div>
      </CustomPaper>
    </ThemeProvider>
  )
}
export default LandingPage
