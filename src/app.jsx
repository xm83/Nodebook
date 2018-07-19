import React from 'react';
import axios from 'axios';
import HomePage from './Components/HomePage'
import MainHub from './Components/MainHub'

import io from 'socket.io-client'

//This Component Calls The Main Page and Should Determine whether or not a User
//Is logged in or not and render accordingly.

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  componentDidMount() {
    // creates a client socket 
    this.socket = io('http://localhost:1337');
    this.socket.on('connect', () => {
      console.log("connected to socket!")
    })
    this.socket.on('disconnect', () => {
      console.log("disconnected to socket!")
    })


    // see if user is logged in already
    axios.get('http://localhost:1337/')
    .then((res) => {
      console.log("res:", res);
      if (res.data.status === 200) {
        // user logged in already
        this.setState({
          loggedIn: true
        })

        // // emit login event - no need to do this
        // this.socket.emit('login', {email: res.data.user.email, password: res.data.user.password}, (res) => {
        //   console.log('status:', res);

        // })

      } else {
        this.setState({
          loggedIn: false
        })
      }
    })
    .catch(err => console.log("err:", err));
  }

  logIn = () => {
    this.setState({
      loggedIn: true
    })
  }

  logOut = () => {
    this.setState({
      loggedIn: false
    })
  }

  render() {
    let log = this.state.loggedIn;
    // if loggedIn is true, go to Doc.js which is our main page

    // pass socket to children components
    return (log ?
      (<MainHub logOut={this.logOut} socket={this.socket}/>)
      :
      (<HomePage logIn={this.logIn} socket={this.socket}/>)
    );
  }
}
