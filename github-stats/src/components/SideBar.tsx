import React, { Component } from 'react';
import { slide as Menu } from "react-burger-menu";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LoginUtils from '../utils/LoginUtils';
import User from '../data/User';
import axios from 'axios';

interface SideState {
  accessToken: string,
  participants: Array<User>
}

interface SideProps {
  triggerParentUpdate(participants: Array<User>): void
}

class SideBar extends Component<SideProps, SideState> { 
    constructor(props: any) {
      super(props);
    }

    async getData() {
      var prNumber: number = 30;
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
  
      /*this.setState({
        participants: users
      });*/

      this.props.triggerParentUpdate(users);
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

    render() {
        return (
          <Menu className="SideBar">
            <label className="SideLabel">SETTINGS</label>
            <TextField
                required
                label="AccessToken" 
                onChange={event => this.setState({accessToken: event.currentTarget.value})}
                variant="filled"
                style={{fontFamily: 'Trim,DAZN-Bold,Oscine', outlineColor: 'black', width: 200, background: 'white'}}
            /> 
            <TextField
                required
                label="Repositories" 
                /* onChange={event => this.setState({title: event.currentTarget.value})} */
                variant="filled"
                style={{fontFamily: 'Trim,DAZN-Bold,Oscine', outlineColor: 'black', width: 200, background: 'white', marginTop: 20}}
            /> 
            <Button
            style={{backgroundColor: '#242d34', marginRight: 20, marginTop: 20, color: '#f8fc00', fontFamily: 'Trim,DAZN-Bold,Oscine'}}
            onClick={() => this.getData()}>
            Save
            </Button>
          </Menu>
        );
      }
    }
    
    export default SideBar;