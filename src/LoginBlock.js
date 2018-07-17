import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import FormLine from './FormLine';
import axios from 'axios'


class LoginBlock extends React.Component {
 constructor(props){
   super(props);
   this.state = {
     email: '',
     pword: ''
   }
 }

  login(){
    console.log("LoginBlock's state:", this.state);
    // log user in
    axios.post('http://localhost:1337/login', {
      username: this.state.email,
      password: this.state.pword,
    })
    .then(resp => {
      if (resp.data.status === 200) {
        console.log("success logging in,", resp);
        this.clear();
        // go to Doc page
        this.props.logIn();
      } else {
        // TODO get back error message?
        console.log("error logging in", resp);
      }
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
  }

  clear (){
   this.setState({
     email: '',
     pword: '',
    })
  }

 render(){
   return (
      <div>
        <div className="text-right" style={{paddingRight: '10px'}}><Button type = "Register" onClick={()=>this.props.toggleReg()}/></div>
        <form className = "well">
          <h3 className = "title"> Login </h3>
          <FormLine name = "Email" type = "text" value = {this.state.email} onChange={(e)=> this.setState({
            email: e.target.value
          })}/>
          <FormLine name = "Password" type = "password" value = {this.state.pword} onChange={(e)=> this.setState({
            pword: e.target.value
          })}/>
          <Button type = "Login" onClick={()=>this.login()}/>
        </form>
      </div>
    );
  }
}


export default LoginBlock;
