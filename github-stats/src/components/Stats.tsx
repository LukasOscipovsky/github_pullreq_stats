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
    return this.state.participants
      .map((p) => {
        return (<UserBar user={p} />)
      });
  }

  render() {
    const loading = this.state.loading;

    let divRender;

    if (loading) {
      divRender = <div className="Loading">
        <CircularProgress
          size={100}
          style={{ color: '#f8fc00' }}
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
          triggerParentUpdate={(data, repository) => this.getData(data, repository)}
          triggerParentLoading={(isLoadingEnabled) => this.setState({ loading: isLoadingEnabled })}
        />
        <div className="Repo">
          <label className="RepoLabel">{this.state.repository}</label>
        </div>
        {divRender}
      </div>
    );
  }
}

export default Stats;