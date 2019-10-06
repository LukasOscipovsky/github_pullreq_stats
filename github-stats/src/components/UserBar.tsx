import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import User from '../data/User';
import { faComments } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


interface IProps {
  user: [number, User],
  sizeOfArray: number;
  ranking: Boolean;
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
    let [color, monthlyColor] = userColor(this.props.user[0], this.props.sizeOfArray, this.props.ranking)
    let user = this.props.user[1];

    function userColor(index: number, sizeOfArray: number, ranking: Boolean): [string, string] {
      let color;
      let monthlyColor;

      if (ranking) {
        if (index === 0) {
          color = '#7FFF00'
          monthlyColor = '#7FFF00'
        } else if (index === sizeOfArray - 1) {
          color = '#DC143C'
          monthlyColor = '#DC143C'
        } else {
          color = '#f8fc00'
          monthlyColor = '#CED0D2'
        }
      } else {
        color = '#f8fc00'
        monthlyColor = '#CED0D2'
      }

      return [color, monthlyColor]
    }

    return (
      <div className='user'>
        <div className='avatar'>
          <img src={user.avatar} className='picture' alt="github user profile pic" />
        </div>
        <div className='form' style={{ background: color }}>
          <label className='label'>{user.name.toUpperCase()}</label>
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
        <div className='data' style={{ background: color }}>
          <label className='label'>{user.approves} / {user.total}</label>
        </div>
        <div className='data' style={{ background: color }}>
          <FontAwesomeIcon color='#242d34' size='2x' icon={faComments} />
          <label className='label'>{user.comments}</label>
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
        <div className='data' style={{ background: monthlyColor }}>
          <label className='label'>{user.monthlyApproves} / {user.monthlyTotal}</label>
        </div>
        <div className='data' style={{ background: monthlyColor }}>
          <FontAwesomeIcon color='#242d34' size='2x' icon={faComments} />
          <label className='label'>{user.monthlyComments}</label>
        </div>
      </div>
    );
  }
}

export default UserBar;