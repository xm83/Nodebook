import React from 'react';
import HomePage from './Components/HomePage'
import Doc from './Components/Doc'

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
