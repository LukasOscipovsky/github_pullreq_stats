import React, { Component, MouseEvent } from 'react';
import UserBar from './UserBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LoginUtils from '../utils/LoginUtils';
import axios from 'axios';
import User from '../data/User';
import SideBar from './SideBar';

class Stats extends Component<{}, {}> { 
  constructor(props: any) {
    super(props);
    this.state = {
      accessToken: '6cae8815f9c348934e7de6c784e57441bb4460c2',
      participants: []
    }

    this.getData(30);
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
        <SideBar/>
        <div className='StatsDiv'>
          {this.compsFromList()}
        </div>
      </div>
    );
  }
}

export default Stats;