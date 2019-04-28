import React, { Component, MouseEvent } from 'react';
import UserBar from './UserBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Stats.css';
import LoginUtils from '../utils/LoginUtils';
import axios from 'axios';
import User from '../data/User';

interface IProps {
  classes: any;
}

interface IState {
  accessToken: string,
  participants: Array<User>
}

class Stats extends Component<IProps, IState> { 
  constructor(props: IProps) {
    super(props);
    this.state = {
      accessToken: '',
      participants: []
    }

    this.getData(10);
    }

  async getData(prNumber: number) {
    var hasNextPage: boolean = true;
    var after: string|null = null;
    var users: Array<User> = [];
    
    do {
      await axios.post(LoginUtils.getUrl(this.state.accessToken),{
        query: LoginUtils.getQuery(prNumber, after),
        headers: LoginUtils.getHeaders()
      })
      .then(response => {
        var prs = response.data.data.organization.repository.pullRequests;
        
        after = prs.pageInfo.endCursor;
        hasNextPage = prs.pageInfo.hasNextPage;
  
        this.parseParent(users, prs.nodes);
      })
    } while (hasNextPage)

    users.sort((u1 ,u2) => ((u1.approves/u1.total) < (u2.approves/u2.total)) ? 1 : -1)

    this.setState({
      participants: users
    });
  }

  parseParent(users: Array<User> ,prs: Array<String>) {
    prs.forEach(pr => {
      var pObj = JSON.parse(JSON.stringify(pr));
      if (pObj.author != null) {
        this.parse(users, pObj.participants.nodes, pObj.reviewRequests.nodes, pObj.reviews.nodes, pObj.author.login);
      }
    });
  }

  parse(users: Array<User>, participants: Array<String>, reviewRequests: Array<String>, reviews: Array<String>, author: string) {
    reviewRequests.forEach(rqst => {
      var rObj = JSON.parse(JSON.stringify(rqst));
      var user = users.find(user => user.name === rObj.requestedReviewer.login);

      if (user == undefined) {
        var newUser = new User(rObj.requestedReviewer.login, rObj.requestedReviewer.avatarUrl);

        newUser.total++;

        users.push(newUser);
      } else {
        user.total++;
      }
    });
    
    participants.forEach(p => {
      var pObj = JSON.parse(JSON.stringify(p));
      var user = users.find(user => user.name === pObj.login);

      if (user == undefined) {
        var newUser = new User(pObj.login, pObj.avatarUrl);

        this.increaseApproves(author, pObj.login, newUser);

        users.push(newUser);
      } else {
        this.increaseApproves(author, pObj.login, user);
      }
    })

    this.updateUsersWithReviews(users, reviews)
  }

  updateUsersWithReviews(participants: Array<User>,reviews: Array<String>) {
    reviews.forEach(r => {
     var rObj = JSON.parse(JSON.stringify(r));
     if (rObj.author != null) {
      this.update(participants, rObj.author.login, rObj.comments.totalCount);
      }
    });
    return participants;
  }

  increaseApproves(author: string, login: string, user: User) {
    if (author !== login) {
      user.approves++;
      user.total++;
    }
  }

  update(users : Array<User>, login: string, comments: number) {
    users.forEach(user => {
      if (user.name == login) {
        user.comments = user.comments + comments;
      }
    })
  }

  compsFromList() {
    console.log(this.state.participants);

    return this.state.participants
    .map((p) => {
      return (<UserBar user={p}/>)
    });
  }

  render() {
    return (
      <div className='MainStatsDiv'>
        <div className='ConfigDiv'>
          <label className='StatsName'>asd</label>
        </div>
        <div className='StatsDiv'>
          {this.compsFromList()}
        </div>
      </div>
    );
  }
}

export default Stats;