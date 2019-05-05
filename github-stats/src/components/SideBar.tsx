import React, { Component } from 'react';
import { slide as Menu } from "react-burger-menu";

class SideBar extends Component<{}, {}> { 
    constructor(props: any) {
      super(props);
    }

    render() {
        return (
          <Menu className="SideBar">
            <a id="home" className="menu-item" href="/">Home</a>
            <a id="about" className="menu-item" href="/about">About</a>
            <a id="contact" className="menu-item" href="/contact">Contact</a>
          </Menu>
        );
      }
    }
    
    export default SideBar;