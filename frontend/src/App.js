import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import CardMedia from '@material-ui/core/CardMedia';
import axios from 'axios';
import { Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ServerCard from './components/ServerCard';

const useStyles = makeStyles((theme) => ({
  root: {

  },
  media: {
    height: 100,
    width: '33%',
    marginLeft: '33%'
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
      <ServerCard details={match}/>
    </div>
  );
}

export default App;
