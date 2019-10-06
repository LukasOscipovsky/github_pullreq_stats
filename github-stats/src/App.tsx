import React, { Component } from 'react';
import Stats from './components/Stats';
import './App.css';
import Favicon from 'react-favicon';

class App extends Component {
  render() {
    return (
      <div className='app'>
        <Favicon url='./Octocat.png' />
        <Stats />
      </div>
    );
  }
}

export default App;
