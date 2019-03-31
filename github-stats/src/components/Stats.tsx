import React, { Component, MouseEvent } from 'react';
import UserBar from './UserBar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Stats.css';
import LoginUtils from '../utils/LoginUtils';
import axios from 'axios';
import { withStyles, Theme } from '@material-ui/core/styles';
import User from '../data/User';
import Review from '../data/Review';

interface IProps {
  classes: any;
}

interface IState {
  accessToken: string,
  author: string
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
  }
});

class Stats extends Component<IProps, IState> { 
  constructor(props: IProps) {
    super(props);
    this.state = {
      accessToken: '',
      author: '',
      participants: []
    };
  }

  async getData() {
    axios.post(LoginUtils.getUrl(this.state.accessToken),{
      query: LoginUtils.getQuery(137),
      headers: LoginUtils.getHeaders()
    })
    .then(response => {
      const pr = response.data.data.organization.repository.pullRequest;

      this.setState({
        author: pr.author.login,
        participants: this.parse(pr.participants.nodes, pr.reviews.nodes)
      });
    })

    console.log(this.state.participants)
  }

  parse(participants: Array<String>, reviews: Array<String>) : Array<User> {
    var ps: Array<User> = [];

    participants.forEach(p => {
      var pObj = JSON.parse(JSON.stringify(p));
      if (this.state.author !== pObj.login) {
        ps.push(new User(pObj.login, pObj.avatarUrl))
      }
    })

    this.getReviews(reviews);

    return ps;
  }

  getReviews(reviews: Array<String>) : Array<Review> {
    var rc: Array<Review> = []; 

    reviews.forEach(r => {
      var rObj = JSON.parse(JSON.stringify(r));
      var entry = this.contains(rc, rObj.author.login);

      if (entry === null) {
        rc.push(rObj.author.login, rObj.comments.totalCount)
      } else {
        var index = rc.indexOf(entry);
        entry.setComments = entry.getComments + rObj.comments.totalCount;
        rc[index] = entry;
      }
    })

    console.log(rc);

    return rc;
  }

  contains(reviews : Array<Review>, login: string) : Review|null {

    reviews.forEach(re => {
      console.log(re.getName)
      if (re.getName === login) {
        return re;
      }
    })

    return null;
  }

  handleClick() : void {
    this.getData()
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container}>
        <TextField
          id="standard-name"
          label="Access Token"
          className={classes.textField}
          value={this.state.accessToken}
          onChange={(e) => this.setState({ accessToken: e.target.value })}
          margin="normal"
        />
        <Button
          name="OK"
          className={classes.button}
          onClick={() => this.handleClick()}  
        >
        OK
        </Button>
        <UserBar/>
      </form>
    );
  }
}

export default Stats;