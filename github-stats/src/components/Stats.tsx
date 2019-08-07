import React, { Component } from 'react';
import UserBar from './UserBar';
import User from '../data/User';
import SideBar from './SideBar';
import CircularProgress from '@material-ui/core/CircularProgress';

interface StatsState {
  loading: boolean;
  participants: Array<[number, User]>;
  repository: string;
}

class Stats extends Component<{}, StatsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      participants: [],
      repository: ''
    }
  }

  getData(data: Array<[number, User]>, repository: string) {
    this.setState({
      loading: false,
      participants: data,
      repository: repository
    })
  }

  compsFromList() {
    let size = this.state.participants.length;

    return this.state.participants
      .map((p) => {
        return (<UserBar user={p} sizeOfArray={size} />)
      });
  }

  render() {
    const loading = this.state.loading;

    let divRender;
    let allTimeStats;
    let monthlyStats;

    if (loading) {
      divRender = <div className="Loading">
        <CircularProgress
          size={100}
          style={{ color: '#f8fc00' }}
        />
        <label className="LoadingLabel">LOADING</label>
      </div>;

      allTimeStats = 'All Time Stats';
      monthlyStats = 'Last Month Stats';
    } else {
      divRender = <div className='StatsDiv'>
        {this.compsFromList()}
      </div>
    }

    return (
      <div className='MainStatsDiv'>
        <SideBar
          triggerParentUpdate={(data, repository) => this.getData(data, repository)}
          triggerParentLoading={(isLoadingEnabled) => this.setState({ loading: isLoadingEnabled })}
        />
        <div className="Title" style={{ left: 900, background: '#f8fc00' }}>
          <label className="TitleLabel">{this.state.repository}</label>
        </div>
        {/* <div className="Title" style={{ left: -200, background: '#f8fc00' }}>
          <label className="TitleLabel">{allTimeStats}</label>
        </div>
        <div className="Title" style={{ left: 350, background: '#CED0D2' }}>
          <label className="TitleLabel">{monthlyStats}</label>
        </div> */}
        {divRender}
      </div>
    );
  }
}

export default Stats;