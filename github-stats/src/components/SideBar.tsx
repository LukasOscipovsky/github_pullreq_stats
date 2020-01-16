import React, { Component } from 'react';
import { slide as Menu } from "react-burger-menu";
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import { getTimeInMillis } from '../utils/date';
import { getOrgOrRepo, getPullRequests } from '../client/githubClient';
import { parsePullRequests } from '../utils/parse';
import User from '../data/User';
import FormControl from '@material-ui/core/FormControl/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';

interface SideState {
  accessToken: string;
  organization: string;
  repository: string;
  showAccessToken: boolean;
  timeToRender: string;
  branch: string;
  ranking: Boolean;
  presentation: Boolean;
  accessTokenErrorState: boolean,
  organizationErrorState: boolean,
  repositoryErrorState: boolean,
  refreshErrorState: boolean,
}

interface SideProps {
  triggerParentUpdate(participants: Array<[number, User]>, repository: string, ranking: Boolean, presentation: Boolean): void
  triggerParentLoading(loading: boolean): void
}

class SideBar extends Component<SideProps, SideState> {
  componentWillMount() {
    const ac = localStorage.getItem('accessToken');
    const org = localStorage.getItem('organization');
    const repo = localStorage.getItem('repository');
    const ttr = localStorage.getItem('timeToRender');
    const br = localStorage.getItem('branch');
    const r = localStorage.getItem('ranking');
    const pre = localStorage.getItem('presentation');

    this.setState({
      accessToken: ac === null ? '' : ac,
      organization: org === null ? '' : org,
      repository: repo === null ? '' : repo,
      showAccessToken: false,
      timeToRender: ttr === null ? '' : ttr,
      branch: br === null ? '' : br,
      ranking: r === null ? false : Boolean(r),
      presentation: pre === null ? false : Boolean(pre),
      accessTokenErrorState: false,
      organizationErrorState: false,
      repositoryErrorState: false,
      refreshErrorState: false
    });
  }

  handleClickShowAccessToken = () => {
    this.setState({
      showAccessToken: !this.state.showAccessToken
    })
  }

  getDataInInterval(): void {
    if (!this.validateState()) {
      return;
    }

    localStorage.setItem('accessToken', this.state.accessToken);
    localStorage.setItem('organization', this.state.organization);
    localStorage.setItem('repository', this.state.repository);
    localStorage.setItem('timeToRender', this.state.timeToRender);
    localStorage.setItem('branch', this.state.branch);
    localStorage.setItem('ranking', this.state.ranking.toString());
    localStorage.setItem('presentation', this.state.presentation.toString());

    this.getData();

    setInterval(() => {
      this.getData();
    }, getTimeInMillis(this.state.timeToRender));
  }

  validateState(): boolean {
    if (this.state.accessTokenErrorState || this.state.accessToken.length === 0) {
      this.setState({ accessTokenErrorState: true })
      return false;
    }

    if (this.state.organizationErrorState || this.state.organization.length === 0) {
      this.setState({ organizationErrorState: true })
      return false;
    }

    if (this.state.repositoryErrorState || this.state.repository.length === 0) {
      this.setState({ repositoryErrorState: true })
      return false;
    }

    if (this.state.refreshErrorState || this.state.timeToRender.length === 0) {
      this.setState({ refreshErrorState: true })
      return false;
    }

    return true;
  }

  async getData() {
    var orgOrRepo: any = await getOrgOrRepo(this.state.accessToken, this.state.organization, this.state.repository);

    if (orgOrRepo.data.data.organization === null) {
      alert('organization does not exist');
      return;
    }

    if (orgOrRepo.data.data.organization.repository === null) {
      alert('repository does not exist');
      return;
    }

    this.props.triggerParentLoading(true);

    var pullRequests: Array<String> | undefined = await getPullRequests(this.state.accessToken,
      this.state.organization, this.state.repository, this.state.branch);

    if (pullRequests === undefined) {
      return;
    }

    var users: Array<[number, User]> = parsePullRequests(pullRequests);
    this.props.triggerParentUpdate(users, this.state.repository, this.state.ranking, this.state.presentation);
  }

  render() {
    return (
      <Menu >
        <label>SETTINGS</label>
        <div>
          <TextField
            required
            label="AccessToken"
            onChange={event => this.setState({
              accessToken: event.currentTarget.value,
              accessTokenErrorState: event.currentTarget.value.length <= 0
            })}
            variant="filled"
            value={this.state.accessToken}
            style={{ fontFamily: 'Trim,DAZN-Bold,Oscine', borderColor: 'black', width: 200, background: 'white' }}
            type={(this.state.showAccessToken ? 'text' : 'password')}
            error={this.state.accessTokenErrorState}
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
            label="Organization"
            onChange={event => this.setState({
              organization: event.currentTarget.value,
              organizationErrorState: event.currentTarget.value.length <= 0
            })}
            value={this.state.organization}
            variant="filled"
            error={this.state.organizationErrorState}
            style={{ fontFamily: 'Trim,DAZN-Bold,Oscine', borderColor: 'black', width: 200, background: 'white', marginTop: 20 }}
          />
          <TextField
            required
            label="Repository"
            onChange={event => this.setState({
              repository: event.currentTarget.value,
              repositoryErrorState: event.currentTarget.value.length <= 0
            })}
            value={this.state.repository}
            variant="filled"
            error={this.state.repositoryErrorState}
            style={{ fontFamily: 'Trim,DAZN-Bold,Oscine', borderColor: 'black', width: 200, background: 'white', marginTop: 20 }}
          />
          <TextField
            label="Branch"
            onChange={event => this.setState({ branch: event.currentTarget.value })}
            variant="filled"
            value={this.state.branch}
            style={{ fontFamily: 'Trim,DAZN-Bold,Oscine', borderColor: 'black', width: 200, background: 'white', marginTop: 20 }}
          />
          <Tooltip title="Input in Hours ('H', 'h', '') or Days('D', 'd')">
            <TextField
              required
              label="Refresh Interval"
              onChange={event => this.setState({
                timeToRender: event.currentTarget.value,
                refreshErrorState: event.currentTarget.value.length <= 0
              })}
              variant="filled"
              value={this.state.timeToRender}
              error={this.state.refreshErrorState}
              style={{ fontFamily: 'Trim,DAZN-Bold,Oscine', borderColor: 'black', width: 200, background: 'white', marginTop: 20 }}
            />
          </Tooltip>
          <FormControl
            style={{ width: 200, background: 'white', marginTop: 20 }}
            variant="outlined">
            <InputLabel style={{ marginTop: 15 }} htmlFor="outlined-ranking">
              Ranking
            </InputLabel>
            <Select
              style={{ padding: 10 }}
              variant="outlined"
              value={this.state.ranking ? 1 : 0}
              onChange={event => this.setState({ ranking: parseInt(event.target.value) === 1 ? true : false })}
              inputProps={{
                name: 'ranking',
                id: 'outlined-ranking',
              }}
            >
              <MenuItem value={0}>Disabled</MenuItem>
              <MenuItem value={1}>Enabled</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            style={{ width: 200, background: 'white', marginTop: 20 }}
            variant="outlined">
            <InputLabel style={{ marginTop: 15 }} htmlFor="outlined-presentation">
              Presentation Mode
            </InputLabel>
            <Select
              style={{ padding: 10 }}
              variant="outlined"
              value={this.state.presentation ? 1 : 0}
              onChange={event => this.setState({ presentation: parseInt(event.target.value) === 1 ? true : false })}
              inputProps={{
                name: 'presentation',
                id: 'outlined-presentation',
              }}
            >
              <MenuItem value={0}>Disabled</MenuItem>
              <MenuItem value={1}>Enabled</MenuItem>
            </Select>
          </FormControl>
          <Button
            style={{ backgroundColor: '#242d34', marginRight: 20, marginTop: 50, color: '#f8fc00', fontFamily: 'Trim,DAZN-Bold,Oscine' }}
            onClick={() => this.getDataInInterval()}>
            Save
            </Button>
        </div>
      </Menu>
    );
  }
}

export default SideBar;