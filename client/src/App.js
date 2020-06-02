import React, { Component } from 'react';
import logo from './logo.svg';

import Player from "./components/Player";

import './App.css';

const authURL = 'https://accounts.spotify.com/authorize?'
const clientId = '96458760d0064d1792db40e609094b19';
const redirectUri = 'http://localhost:3000';
const scopes = [
  'user-read-currently-playing',
  'user-read-playback-state',
];

const hash = window.location.hash.substring(1).split("&").reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});

class App extends Component {


  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms: 0
      },
      is_playing: "Paused",
      progress_ms: 0
    };
  }
  
  componentDidMount() {
    let token = hash.access_token;

    if (token) {
      this.setState({
        token: token
      });
      this.getCurrentlyPlaying(token);
      this.getCurrentUser(token)
    }
  }

  getCurrentUser = (token) => {
    fetch("https://api.spotify.com/v1/me", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => console.log(response.json()))
  }

  getCurrentlyPlaying = (token) => {
    fetch("https://api.spotify.com/v1/me/player", {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then( data => 
        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms
        }))
  }
  
  render() {
    return (
      <div className="App">
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      {!this.state.token && (
        <a
          className="btn btn--loginApp-link"
          href={`${authURL}&client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}`}
        >
          Login to Spotify
  
        </a>
      )}
      {this.state.token && (
        <Player
        item={this.state.item}
        is_playing={this.state.is_playing}
        progress_ms={this.progress_ms}
      />
      )}
      </header>
    </div>
  );
  }
}

export default App;
