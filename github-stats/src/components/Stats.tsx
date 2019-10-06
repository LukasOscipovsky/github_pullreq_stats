import React, { Component } from 'react';
import UserBar from './UserBar';
import User from '../data/User';
import SideBar from './SideBar';
import CircularProgress from '@material-ui/core/CircularProgress';

interface StatsState {
  loading: boolean;
  participants: Array<[number, User]>;
  repository: string;
  ranking: Boolean;
}

class Stats extends Component<{}, StatsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      participants: [],
      repository: '',
      ranking: false
    }
  }

  getData(data: Array<[number, User]>, repository: string, ranking: Boolean) {
    this.setState({
      loading: false,
      participants: data,
      repository: repository,
      ranking: ranking
    })

    console.log(this.state.ranking);
  }

  compsFromList() {
    let size = this.state.participants.length;

    return this.state.participants
      .map((p) => {
        return (<UserBar user={p} sizeOfArray={size} ranking={this.state.ranking} />)
      });
  }

  render() {
    let divRender;
    let allTimeStats = 'All Time Stats';
    let monthlyStats = 'Last Month Stats';
    let user = 'User';

    if (this.state.loading) {
      divRender = <div className="loading">
        <CircularProgress
          size={100}
          style={{ color: '#f8fc00' }}
        />
        <label className="label">LOADING</label>
      </div>;
    } else {
      divRender = <div className='stats'>
        {this.compsFromList()}
      </div>
    }

    return (
      <div className='main'>
        <SideBar
          triggerParentUpdate={(data, repository, ranking) => this.getData(data, repository, ranking)}
          triggerParentLoading={(isLoadingEnabled) => this.setState({ loading: isLoadingEnabled })}
        />
        {/* <div className='header'>
          <div className="statstitle" style={{ marginLeft: 150, background: '#f8fc00' }}>
            <label className="label" style={{ fontSize: 30 }}>{user}</label>
          </div>
          <div className="statstitle" style={{ marginLeft: 380, background: '#f8fc00' }}>
            <label className="label" style={{ fontSize: 30 }}>{allTimeStats}</label>
          </div>
          <div className="statstitle" style={{ marginLeft: 250, background: '#CED0D2' }}>
            <label className="label" style={{ fontSize: 30 }}>{monthlyStats}</label>
          </div>
        </div> */}
        <div className="title" style={{ left: '47.5%', background: '#f8fc00' }}>
          <label className="label" style={{ fontSize: 60 }}>{this.state.repository}</label>
        </div>
        {divRender}
      </div>
    );
  }
}

export default Stats;