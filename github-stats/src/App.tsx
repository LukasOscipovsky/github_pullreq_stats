import React, { Component } from 'react';
import logo from './logo.svg';
import CircularProgressbar from 'react-circular-progressbar';
import './App.css';

const approved:number = 15;
const all:number = 84
const percentage: number = calculatePercentage(approved, all)

function calculatePercentage(partialValue: number, totalValue: number) {
  return Math.floor((100 * partialValue) / totalValue);
} 

class App extends Component {
  render() {
    return (
      <div className="App">
        <CircularProgressbar
          percentage={percentage}
          text={`${percentage}%`}
          />
      </div>
    );
  }
}

export default App;
