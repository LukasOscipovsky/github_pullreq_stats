import React, { Component, MouseEvent } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import Button from '@material-ui/core/Button';
import './UserBar.css';
import LoginUtils from '../utils/LoginUtils';
import axios from 'axios';

class UserBar extends Component<{}, {}> { 
  private data: string;
  
  constructor(props: any) {
    super(props);
    this.data = "";
  }
  calculatePercentage(partialValue: number, totalValue: number) {
    return Math.floor((100 * partialValue) / totalValue);
  }

  getPercentage() : number {
    let approved:number = 15;
    let all:number = 84;

    return this.calculatePercentage(approved, all)
  }

  getData() : void {
    axios.post(LoginUtils.getUrl(),{
      query: LoginUtils.getQuery(143),
      headers: LoginUtils.getHeaders()
    })
    .then(response => {
        return JSON.parse(JSON.stringify(response.data))
    }).then(data => console.log(data))
  }

  handleClick() : void {
    this.getData()
  }

  render() {
    return (
      <div className="UserBar">
        <CircularProgressbar
          percentage={this.getPercentage()}
          text={`${this.getPercentage()}%`}
        />
        <Button
          name="OK"
          onClick={() => this.handleClick()}  
        >
        OK
        </Button>
      </div>
    );
  }
}

export default UserBar;