import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'

const LandingPage = () => {
  const buttonStyle = {
    color: '#f0efec',
    backgroundColor: '#7a55c7',
  }

  // TODO: fetch the link to bot from backend
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