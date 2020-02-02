import React, { Component } from 'react';
import UserBar from './UserBar';
import User from '../data/User';
import SideBar from './SideBar';
import CircularProgress from '@material-ui/core/CircularProgress';


interface StatsState {
  loading: boolean;
  prToRender: Array<[number, User]>;
  repository: string;
  ranking: Boolean;
  displaySideRepo: boolean;
  presentationMode: boolean;
}

const userCompsSize: number = 5;

class Stats extends Component<{}, StatsState> {
  private currentIndex: number = 0;
  private participants: Array<[number, User]> = [];

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      prToRender: [],
      repository: '',
      ranking: false,
      displaySideRepo: false,
      presentationMode: true
    }
  }

  getData(data: Array<[number, User]>, repository: string, ranking: Boolean) {
    this.setState({
      loading: false,
      repository: repository,
      ranking: ranking,
      displaySideRepo: true
    })

    this.participants = data;

    if (!this.state.presentationMode || data.length <= userCompsSize) {
      this.compsFromList();
      return;
    }
    setInterval(() => {
      this.compsFromList();
    }, 5000);
  }

  compsFromList() {
    if (!this.state.presentationMode || this.participants.length <= userCompsSize) {
      this.setState({ prToRender: this.participants });
    }

    if (this.currentIndex > this.participants.length) {
      this.currentIndex = 0;
    }

    let temp = this.currentIndex;
    this.currentIndex = this.currentIndex + userCompsSize;

    this.setState({ prToRender: this.participants.slice(temp, this.currentIndex) });
  }

  getComps() {
    return this.state.prToRender.map((p) => {
      return (<UserBar user={p} sizeOfArray={this.participants.length} ranking={this.state.ranking} />)
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
        {this.getComps()}
      </div>
    }

    return (
      <div className='main'>
        <SideBar
          triggerParentUpdate={(data, repository, ranking) => this.getData(data, repository, ranking)}
          triggerParentLoading={(isLoadingEnabled) => this.setState({ loading: isLoadingEnabled })}
        />
        {divRender}
        <div className="title" style={{ display: this.state.displaySideRepo ? 'block' : 'none', background: '#f8fc00' }}>
          <label className="label" style={{ fontSize: 60 }}>{this.state.repository}</label>
        </div>
      </div>
    );
  }
}

export default Stats;