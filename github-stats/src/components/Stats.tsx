import React, { Component, MouseEvent } from 'react';
import UserBar from './UserBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Stats.css';
import LoginUtils from '../utils/LoginUtils';
import axios from 'axios';
import { withStyles, Theme } from '@material-ui/core/styles';
import User from '../data/User';

interface IProps {
  classes: any;
}

interface IState {
  accessToken: string,
  participants: Array<User>
}

const styles = (theme:Theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400,
  },
  button: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
});

class Stats extends Component<IProps, IState> { 
  
  constructor(props: IProps) {
    super(props);
    this.state = {
      accessToken: '3c1745ac16e137b72bc0d799058b968b21311df4',
      participants: []
    }

    this.getData();
    }

  async getData() {
    axios.post(LoginUtils.getUrl(this.state.accessToken),{
      query: LoginUtils.getQuery(137),
      headers: LoginUtils.getHeaders()
    })
    .then(response => {
      const pr = response.data.data.organization.repository.pullRequest;

      this.setState({
        participants: this.parse(pr.participants.nodes, pr.reviews.nodes, pr.author.login)
      });
    })
  }

  parse(participants: Array<String>, reviews: Array<String>, author: string) : Array<User> {
    var ps: Array<User> = [];

    participants.forEach(p => {
      var pObj = JSON.parse(JSON.stringify(p));
      var user =new User(pObj.login, pObj.avatarUrl);
      
      if (author !== pObj.login) {
        user.approves++;
      }

      ps.push(user);
    })

    this.updateUsersWithReviews(ps, reviews)

    return ps;
  }

  updateUsersWithReviews(participants: Array<User>,reviews: Array<String>) {
    reviews.forEach(r => {
     var rObj = JSON.parse(JSON.stringify(r));
     this.update(participants, rObj.author.login, rObj.comments.totalCount);
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
    return this.state.participants
    .map((p) => {
      return (<UserBar user={p} approves={1}/>)
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