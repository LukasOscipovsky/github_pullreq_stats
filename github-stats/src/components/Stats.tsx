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
  scrollTop: HTMLDivElement | null;
  scrollDown: HTMLDivElement | null;

  constructor(props: any) {
    super(props);
    this.scrollTop = null;
    this.scrollDown = null;
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
        {divRender}
        <div className="title" style={{ background: '#f8fc00' }}>
          <label className="label" style={{ fontSize: 60 }}>{this.state.repository}</label>
        </div>
      </div>
    );
  }
}

export default Stats;