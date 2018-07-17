import React from 'react';
import Login from './Login'
import HomePage from './HomePage.js'
import Doc from './Doc.js'
import axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  componentDidMount() {
    // see if user is logged in already
    axios.get('http://localhost:1337/')
    .then((res) => {
      console.log("res:", res);
      if (res.data.status === 200) {
        // user logged in already
        this.setState({
          loggedIn: true
        })
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

  render() {
    let log = this.state.loggedIn
    // if loggedIn is true, go to Doc.js which is our main page
    return (log ?
      (<Doc />)
      :
      (<HomePage logIn={this.logIn}/>)
    );
  }
}
