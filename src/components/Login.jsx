import React from 'react';

import ReactDOM from 'react-dom';

import LoginBlock from './LoginBlock'

const dbUrl = "http://localhost:3000/db";

//This component brings the user to a form that allows him to log in
class Login extends React.Component {
  constructor(props){
    super(props);
  }

 render() {
   return (<div id= "login">
           <center>
             <h2 style={{marginTop: '10vh', paddingBottom: '3vh'}}>Welcome</h2>
             <LoginBlock toggleReg={this.props.toggleReg} logIn={this.props.logIn}/>
             <div style={{color: 'grey', paddingTop: '15vh'}} className="textMuted">
                 We hope you enjoy NAME HERE as much as we do, please login to your account below or register if this is your first time using our product
             </div>
           </center>
           </div>);
  }

}

export default Login;
