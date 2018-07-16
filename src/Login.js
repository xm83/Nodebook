import React from 'react';
import ReactDOM from 'react-dom';
import LoginBlock from './LoginBlock.js'

const dbUrl = "http://localhost:3000/db";

class Login extends React.Component {
 constructor(props){
   super(props);

 }

 render(){
   return (<div id= "login"><center>
             <h2>Welcome</h2>
               <br/>
             <h4>
                 We hope you enjoy NAME HERE as much as we do, please login to your account below or register if this is your first time using our product
             </h4>
             <LoginBlock toggleReg={this.props.toggleReg}/></center>
           </div>);
 }
}

export default Login;
