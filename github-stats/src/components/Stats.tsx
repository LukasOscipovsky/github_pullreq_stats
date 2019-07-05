import React, { Component, MouseEvent } from 'react';
import UserBar from './UserBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LoginUtils from '../utils/LoginUtils';
import axios from 'axios';
import User from '../data/User';
import SideBar from './SideBar';

interface StatsState {
  participants: Array<User>
}

class Stats extends Component<{}, StatsState> { 
  constructor(props: any) {
    super(props);
      this.state = {
        participants: []
      }
    }

  getData(data: Array<User>) {
    console.log(data);
    this.setState({participants: data})
  }

  compsFromList() {
    return this.state.participants
    .map((p) => {
      return (<UserBar user={p}/>)
    });
  }

  render() {
    return (
      <div className='MainStatsDiv'>
        <SideBar triggerParentUpdate={(data) => this.getData(data)} />
        <div className='StatsDiv'>
          {this.compsFromList()}
        </div>
      </div>
    );
  }
}

export default Stats;