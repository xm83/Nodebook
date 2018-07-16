import React from 'react';
import Login from './Login'
import HomePage from './HomePage.js'
import Doc from './Doc.js'

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
      (<Doc />)
      :
      (<HomePage logIn={this.logIn}/>)
    );
  }
}
