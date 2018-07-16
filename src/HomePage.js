import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login.js';
import SignUp from './Signup.js';

class HomePage extends React.Component {
 constructor(props){
   super(props);
   this.state = {
     register: false,
   }
 }

 toggleReg = () => {
   this.setState({
     register: !this.state.register,
   })
 }

 render(){
   let reg = this.state.register
   console.log(reg)
   return (reg ?
    ( <SignUp toggleReg={() => this.toggleReg()}/> )
    :
    ( <Login toggleReg={() => this.toggleReg()}/> )
  );
 }
}

export default HomePage;
