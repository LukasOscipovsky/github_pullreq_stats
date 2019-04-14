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
      accessToken: '',
      participants: []
    }
    this.getData(2);
    }

  async getData(prNumber: number) {
    axios.post(LoginUtils.getUrl(this.state.accessToken),{
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
      this.parse(users, pObj.participants.nodes, pObj.reviews.nodes, pObj.author.login);

      console.log(users);
    });

    return users;
  }

  parse(users: Array<User>,participants: Array<String>, reviews: Array<String>, author: string) {
    participants.forEach(p => {
      var pObj = JSON.parse(JSON.stringify(p));
      var user = this.getUser(users, pObj.login, pObj.avatarUrl);
      
      if (user === null) {
        var newUser = new User(pObj.login, pObj.avatarUrl);

        if (author !== pObj.login) {
          newUser.approves++;
        }

        users.push(newUser);
      } else {
        if (author !== pObj.login) {
          user.approves++;
        }
      }
    })

    this.updateUsersWithReviews(users, reviews)
  }

  getUser(users: Array<User>, name: string, avatarUrl: string): User|null {
    users.forEach(u => {
      if (name === u.name) {
        return u;
      }
    })

    return null;
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