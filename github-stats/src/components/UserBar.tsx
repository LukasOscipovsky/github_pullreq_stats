import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import FormLabel from '@material-ui/core/FormLabel';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import User from '../data/User';
import { faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


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
          <div className='UserBar'>
            <div className='UserPictureDiv'>
              <img src={this.props.user.avatar} className='UserPicture' />
            </div>
            <div className='FormDiv'>
              <label className='FormLabel'>{this.props.user.name.toUpperCase()}</label>
            </div>
            <CircularProgressbar
              percentage={this.getPercentage()}
              text={`${this.getPercentage()}%`}
            />
            <div className='CommentsDiv'>
              <FontAwesomeIcon color='#242d34' size='2x' icon={faComments}/>
              <label className='CommentsLabel'>{this.props.user.comments}</label>
            </div>
          </div>
        );
      }
    }
    
    export default UserBar;