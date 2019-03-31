import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';

class UserBar extends Component<{}, {}> { 

    calculatePercentage(partialValue: number, totalValue: number) {
        return Math.floor((100 * partialValue) / totalValue);
    }
    
    getPercentage() : number {
        let approved:number = 15;
        let all:number = 49;
    
        return this.calculatePercentage(approved, all)
    }

    render() {
        return (
          <div className="UserBar">
            <CircularProgressbar
              percentage={this.getPercentage()}
              text={`${this.getPercentage()}%`}
            />
          </div>
        );
      }
    }
    
    export default UserBar;