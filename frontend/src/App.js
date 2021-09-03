import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import alt from './components/altimage.jpg';
import './App.css';
import CardMedia from '@material-ui/core/CardMedia';
import axios from 'axios';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}));

function App({ match }) {
  const [userInfo, setUserInfo] = useState({});
  console.log(match)

  useEffect(() => {
    axios.post('http://localhost:8080/verify', {
      token: match.params.token,
    })
      .then(function (response) {
        console.log(response);
        setUserInfo(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();
  console.log(userInfo);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <Card>
        <CardMedia className={classes.media} image={userInfo && Object.keys(userInfo).length > 0 ? userInfo.user.icon : alt}></CardMedia>
      </Card>
    </div>
  );
}

export default App;
