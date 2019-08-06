import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import User from '../data/User';
import { faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


interface IProps {
  user: [number, User],
}

class UserBar extends Component<IProps, {}> {
  calculatePercentage(partialValue: number, totalValue: number) {
    return Math.floor((100 * partialValue) / totalValue);
  }

  getPercentage(): number {
    let user = this.props.user[1];

    return Math.floor((100 * user.approves) / user.total);
  }

  getMonthlyPercentage(): number {
    let user = this.props.user[1];

    return Math.floor((100 * user.monthlyApproves) / user.monthlyTotal);
  }

  render() {
    let user = this.props.user[1];
    let color;
    let monthlyColor;

    if (this.props.user[0] === 0) {
      color = '#7FFF00'
      monthlyColor = '#7FFF00'
    } else {
      color = '#f8fc00'
      monthlyColor = '#CED0D2'
    }

    return (
      <div className='UserBar'>
        <div className='UserPictureDiv'>
          <img src={user.avatar} className='UserPicture' alt="github user profile pic" />
        </div>
        <div className='FormDiv' style={{ background: color }}>
          <label className='FormLabel'>{user.name.toUpperCase()}</label>
        </div>
        <CircularProgressbar
          percentage={this.getPercentage()}
          text={`${this.getPercentage()}%`}
          styles={{
            path: {
              stroke: color
            },
            text: {
              fill: color
            }
          }}
        />
        <div className='DataDiv' style={{ background: color }}>
          <label className='DataLabel'>{user.approves} / {user.total}</label>
        </div>
        <div className='DataDiv' style={{ background: color }}>
          <FontAwesomeIcon color='#242d34' size='2x' icon={faComments} />
          <label className='DataLabel'>{user.comments}</label>
        </div>
        <CircularProgressbar
          percentage={this.getMonthlyPercentage()}
          text={`${this.getMonthlyPercentage()}%`}
          styles={{
            path: {
              stroke: monthlyColor
            },
            text: {
              fill: monthlyColor
            }
          }}
        />
        <div className='DataDiv' style={{ background: monthlyColor }}>
          <label className='DataLabel'>{user.monthlyApproves} / {user.monthlyTotal}</label>
        </div>
        <div className='DataDiv' style={{ background: monthlyColor }}>
          <FontAwesomeIcon color='#242d34' size='2x' icon={faComments} />
          <label className='DataLabel'>{user.monthlyComments}</label>
        </div>
      </div>
    );
  }
}

export default UserBar;