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
  presentationMode: Boolean;
}

const userCompsSize: number = 10;

class Stats extends Component<{}, StatsState> {
  private currentIndex: number = 0;
  private interval: any = null;
  private participants: Array<[number, User]> = [];

  constructor(props: any) {
    super(props);
    this.state = {
      loading: false,
      prToRender: [],
      repository: '',
      ranking: false,
      displaySideRepo: false,
      presentationMode: false
    }
  }

  getData(data: Array<[number, User]>, repository: string, ranking: Boolean, presentation: Boolean) {
    this.setState({
      loading: false,
      repository: repository,
      ranking: ranking,
      displaySideRepo: true,
      presentationMode: presentation
    })

    this.participants = data;
    clearInterval(this.interval);

    console.log(this.state.presentationMode)

    if (!this.state.presentationMode || data.length <= userCompsSize) {
      this.setState({ prToRender: this.participants });
      this.getComps();
      return;
    }

    this.setDataForInterval();

    this.interval = setInterval(() => {
      this.setDataForInterval();
    }, 10000);
  }

  setDataForInterval() {
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
          triggerParentUpdate={(data, repository, ranking, presentation) => this.getData(data, repository, ranking, presentation)}
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