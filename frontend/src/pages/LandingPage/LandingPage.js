import React from 'react'
import { useTheme, ThemeProvider } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'

// I have no idea what is wrong here, find out how to access the theme
// This page has no theming and such, it's ment to load quickly. I don't really like that
// So this thing is going to go

//Rewrite, maybe there is some merit to it, there isn't much to style so i guess it can be manually maintained
const LandingPage = () => {
  const theme = useTheme();
  const buttonStyle = {
    color: '#f0efec',
    backgroundColor: '#7a55c7',
  }

  return (
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
        flexDirection: 'row',
        backgroundImage: `url("http://localhost:8080/assets/landing.jpg")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div style={{ padding: 20 }}>
        <Button sx={{ fontWeight: 'fontWeightBold' }} size="large" style={buttonStyle} variant="contained" component="a" href="https://discord.com/api/oauth2/authorize?client_id=775667315706560533&permissions=8&scope=bot" target="_blank" >Invite me!</Button>
      </div>
      <div>
        <Button sx={{ fontWeight: 'fontWeightBold' }} size="large" style={buttonStyle} variant="contained" component={Link} to="/dashboard">Dashboard</Button>
      </div>
    </div>
  )
}
export default LandingPage
