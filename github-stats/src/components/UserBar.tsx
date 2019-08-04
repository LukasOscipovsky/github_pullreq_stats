import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import User from '../data/User';
import { faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


interface IProps {
  user: User,
}

class UserBar extends Component<IProps, {}> {
  calculatePercentage(partialValue: number, totalValue: number) {
    return Math.floor((100 * partialValue) / totalValue);
  }

  getPercentage(): number {
    return Math.floor((100 * this.props.user.approves) / this.props.user.total);
  }

  render() {

    let colorToRender;

    if (!this.props.user.bestInTheMonth) {
      colorToRender = '#f8fc00';
    } else {
      colorToRender = '#7FFF00';
    }

    return (
      <div className='UserBar'>
        <div className='UserPictureDiv'>
          <img src={this.props.user.avatar} className='UserPicture' alt="github user profile pic"/>
        </div>
        <div className='FormDiv' style={{background: colorToRender}}>
          <label className='FormLabel'>{this.props.user.name.toUpperCase()}</label>
        </div>
        <CircularProgressbar
          percentage={this.getPercentage()}
          text={`${this.getPercentage()}%`}
          styles={{
            path: {
              stroke: colorToRender
            },
            text: {
              fill: colorToRender
            }
          }}
        />
        <div className='DataDiv' style={{background: colorToRender}}>
          <label className='DataLabel'>{this.props.user.approves} / {this.props.user.total}</label>
        </div>
        <div className='DataDiv' style={{background: colorToRender}}>
          <FontAwesomeIcon color='#242d34' size='2x' icon={faComments} />
          <label className='DataLabel'>{this.props.user.comments}</label>
        </div>
      </div>
    );
  }
}

export default UserBar;