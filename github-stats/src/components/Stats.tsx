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

    this.getData(30);
    }

  async getData(prNumber: number) {
    var prs = axios.post(LoginUtils.getUrl(this.state.accessToken),{
      query: LoginUtils.getQuery2(prNumber),
      headers: LoginUtils.getHeaders()
    })
    .then(response => {
      var prs = response.data.data.organization.repository.pullRequests.nodes;

      this.setState({
        participants: this.parseParent(prs)
      });
    })
  }

  parseParent(prs: Array<String>) : Array<User> {
    var users: Array<User> = [];

    prs.forEach(pr => {
      var pObj = JSON.parse(JSON.stringify(pr));
      if (pObj.author != null) {
        this.parse(users, pObj.participants.nodes, pObj.reviewRequests.nodes, pObj.reviews.nodes, pObj.author.login);
      }
    });

    return users;
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

        if (author !== pObj.login) {
          newUser.approves++;
          newUser.total++;
        }

        users.push(newUser);
      } else {
        if (author !== pObj.login) {
          user.approves++;
          user.total++;
        }
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
      <div className='Stats'>
        {this.compsFromList()}
      </div>
    );
  }
}

export default Stats;