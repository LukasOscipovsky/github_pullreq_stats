import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import FormLabel from '@material-ui/core/FormLabel';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import { withStyles, Theme } from '@material-ui/core/styles';
import User from '../data/User';

interface IProps {
  user: User,
}

class UserBar extends Component<IProps, {}> { 
    constructor(props: IProps) {
      super(props);
    }

    calculatePercentage(partialValue: number, totalValue: number) {
        return Math.floor((100 * partialValue) / totalValue);
    }
    
    getPercentage() : number {
        return Math.floor((100 * this.props.user.approves) / this.props.user.total);
    }

    render() {
        return (
          <div className="UserBar">
            <img src={this.props.user.avatar} className='UserPicture' />
            <div className='FormDiv'>
              <label className='FormLabel'>{this.props.user.name.toUpperCase()}</label>
            </div>
            <CircularProgressbar
              percentage={this.getPercentage()}
              text={`${this.getPercentage()}%`}
            />
          </div>
        );
      }
    }
    
    export default UserBar;