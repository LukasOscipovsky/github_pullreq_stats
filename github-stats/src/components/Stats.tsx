import React, { Component, MouseEvent } from 'react';
import UserBar from './UserBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LoginUtils from '../utils/LoginUtils';
import axios from 'axios';
import User from '../data/User';
import SideBar from './SideBar';
import CircularProgress from '@material-ui/core/CircularProgress';

interface StatsState {
  loading: boolean;
  participants: Array<User>
}

class Stats extends Component<{}, StatsState> { 
  constructor(props: any) {
    super(props);
      this.state = {
        loading: false,
        participants: []
      }
    }

  getData(data: Array<User>) {
    this.setState({
      loading: false,
      participants: data
    })
  }

  compsFromList() {
    return this.state.participants
    .map((p) => {
      return (<UserBar user={p}/>)
    });
  }

  render() {
    const loading = this.state.loading;

    let divRender;

    if (loading) {
      divRender = <div className="Loading">
      <CircularProgress
        size={100}
        style={{color: '#f8fc00'}}
      />
      <label className="LoadingLabel">LOADING</label>
    </div>;
    } else {
      divRender = <div className='StatsDiv'>
      {this.compsFromList()}
      </div>
    }

    return (
      <div className='MainStatsDiv'>
        <SideBar 
        triggerParentUpdate={(data) => this.getData(data)} 
        triggerParentLoading={(isLoadingEnabled) => this.setState({loading: isLoadingEnabled})}
        />
        {divRender}
      </div>
    );
  }
}

export default Stats;