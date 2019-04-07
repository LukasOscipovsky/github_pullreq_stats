import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import FormLabel from '@material-ui/core/FormLabel';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import { withStyles, Theme } from '@material-ui/core/styles';

interface IProps {
  classes: any;
}

class UserBar extends Component<IProps, {}> { 
    constructor(props: IProps) {
      super(props);
    }

    calculatePercentage(partialValue: number, totalValue: number) {
        return Math.floor((100 * partialValue) / totalValue);
    }
    
    getPercentage() : number {
        let approved:number = 15;
        let all:number = 49;
    
        return this.calculatePercentage(approved, all)
    }

    render() {
        const { classes } = this.props;

        return (
          <div className="UserBar">
            <img src={require('../assets/images/lukas.jpg')} className='UserPicture' />
            <div className='FormDiv'>
              <label className='FormLabel'>LUKAS OSCIPOVSKY</label>
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