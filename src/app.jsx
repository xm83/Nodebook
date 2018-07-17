import React from 'react';
import axios from 'axios';
import HomePage from './Components/HomePage'
import MainHub from './Components/MainHub'

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

  logOut = () => {
    this.setState({
      loggedIn: false
    })
  }

  render() {
    let log = this.state.loggedIn
    // if loggedIn is true, go to Doc.js which is our main page
    return (log ?
      (<MainHub logOut={this.logOut}/>)
      :
      (<HomePage logIn={this.logIn} />)
    );
  }
}
