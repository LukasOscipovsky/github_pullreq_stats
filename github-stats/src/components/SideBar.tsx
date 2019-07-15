import React, { Component, ChangeEvent } from 'react';
import { slide as Menu } from "react-burger-menu";
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import LoginUtils from '../utils/LoginUtils';
import DateUtils from '../utils/DateUtils';
import ParseUtils from '../utils/ParseUtils';
import User from '../data/User';
import axios from 'axios';

interface SideState {
  accessToken: string;
  repository: string;
  showAccessToken: boolean;
  timeToRender: string;
  branch: string;
}

interface SideProps {
  triggerParentUpdate(participants: Array<User>): void
  triggerParentLoading(loading: boolean): void
}

class SideBar extends Component<SideProps, SideState> { 
    componentWillMount() {
      const ac = localStorage.getItem('accessToken');
      const repo = localStorage.getItem('repository');
      const ttr = localStorage.getItem('timeToRender');
      const br = localStorage.getItem('branch');

      this.setState({
        accessToken: ac === null ? '' : ac,
        repository: repo === null ? '' : repo,
        showAccessToken: false,
        timeToRender: ttr === null ? '' : ttr,
        branch: br === null ? '' : br
      })
    }

    handleClickShowAccessToken = () => {
      this.setState({
        showAccessToken: !this.state.showAccessToken
      })
    }

    handleOnChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
      this.setState({repository: event.currentTarget.value})
    }

    getDataInInterval() {
      if (!this.validateState()) {
        return;
      }

      localStorage.setItem('accessToken', this.state.accessToken);
      localStorage.setItem('repository', this.state.repository);
      localStorage.setItem('timeToRender', this.state.timeToRender);
      localStorage.setItem('branch', this.state.branch);

      this.getData();
      setInterval(() => {
        this.getData();  
      }, DateUtils.getTimeInMillis(this.state.timeToRender))
    }

    validateState() : boolean {
      if (this.state.accessToken === undefined || this.state.accessToken === '') {
        alert("AccessToken has not been provided!")
        return false;
      }

      if (this.state.repository === undefined || this.state.repository === '') {
        alert("Repository has not been provided!")
        return false;
      }

      if (this.state.timeToRender === undefined || this.state.timeToRender === '') {
        alert("Refresh interval has not been provided!")
        return false;
      }

      return true;
    } 

    async getData() {
      this.props.triggerParentLoading(true);

      var prNumber: number = 30;
      var hasNextPage: boolean = true;
      var after: string|null = null;
      var users: Array<User> = [];
      
      do {
        await axios.post(LoginUtils.getUrl(this.state.accessToken),{
          query: LoginUtils.getQuery(prNumber, this.state.repository, after, this.state.branch),
          headers: LoginUtils.getHeaders()
        })
        .then(response => {
          var prs = response.data.data.organization.repository.pullRequests;
          
          after = prs.pageInfo.endCursor;
          hasNextPage = prs.pageInfo.hasNextPage;
    
          ParseUtils.parseParent(users, prs.nodes);
        })
      } while (hasNextPage)
  
      users = users.filter(u => u.total > 0).sort((u1 ,u2) => ((u1.approves/u1.total) < (u2.approves/u2.total)) ? 1 : -1)
      
      this.props.triggerParentUpdate(users);
    }

    render() {
        return (
          <Menu className="SideBar">
            <label className="SideLabel">SETTINGS</label>
            <div className="Inputs">
            <TextField
                required
                label="AccessToken" 
                onChange={event => this.setState({accessToken: event.currentTarget.value})}
                variant="filled"
                value={this.state.accessToken}
                style={{fontFamily: 'Trim,DAZN-Bold,Oscine', borderColor: 'black', width: 200, background: 'white'}}
                type={(this.state.showAccessToken ? 'text' : 'password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowAccessToken}
                      >
                        {(this.state.showAccessToken ? <Visibility /> : <VisibilityOff />)}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
            /> 
            <TextField
                required
                label="Repository" 
                onChange={event => this.handleOnChange(event)}
                value={this.state.repository}
                variant="filled"
                style={{fontFamily: 'Trim,DAZN-Bold,Oscine', borderColor: 'black', width: 200, background: 'white', marginTop: 20}}
            />
            <TextField
                label="Branch"
                onChange={event => this.setState({branch: event.currentTarget.value})}
                variant="filled"
                value={this.state.branch}
                style={{fontFamily: 'Trim,DAZN-Bold,Oscine', borderColor: 'black', width: 200, background: 'white', marginTop: 20}}
            />
            <Tooltip title="Input in Hours ('H', 'h', '') or Days('D', 'd')">
              <TextField
                  required
                  label="Refresh Interval"
                  onChange={event => this.setState({timeToRender: event.currentTarget.value})}
                  variant="filled"
                  value={this.state.timeToRender}
                  style={{fontFamily: 'Trim,DAZN-Bold,Oscine', borderColor: 'black', width: 200, background: 'white', marginTop: 20}}
              />
            </Tooltip>
            <Button
              style={{backgroundColor: '#242d34', marginRight: 20, marginTop: 20, color: '#f8fc00', fontFamily: 'Trim,DAZN-Bold,Oscine'}}
              onClick={() => this.getDataInInterval()}>
              Save
            </Button>
            </div>
          </Menu>
        );
      }
    }
    
    export default SideBar;