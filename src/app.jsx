import React from 'react';
import HomePage from './Components/HomePage'
import Doc from './Components/Doc'
import MainHub from './Components/MainHub'

//This Component Calls The Main Page and Should Determine whether or not a User
//Is logged in or not and render accordingly.

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: true
    }
  }

  logIn = () => {
    this.setState({
      loggedIn: true
    })
  }

  render() {
    let log = this.state.loggedIn
    return (log ?
      (<MainHub />)
      :
      (<HomePage logIn={this.logIn}/>)
    );
  }
}
