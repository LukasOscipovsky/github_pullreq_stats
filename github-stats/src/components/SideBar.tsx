import React, { Component } from 'react';
import { slide as Menu } from "react-burger-menu";
import TextField from '@material-ui/core/TextField';

class SideBar extends Component<{}, {}> { 
    constructor(props: any) {
      super(props);
    }

    render() {
        return (
          <Menu className="SideBar">
            <TextField
                        required
                        label="AccessToken" 
                        /* onChange={event => this.setState({title: event.currentTarget.value})} */
                        placeholder="AccessToken"
                        variant="filled"
                        style={{fontFamily: 'Trim,DAZN-Bold,Oscine', outlineColor: 'black', width: 200, background: 'white'}}
                    /> 
          </Menu>
        );
      }
    }
    
    export default SideBar;