import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import FormLine from './FormLine';
import axios from 'axios'


//This component is the actual form itself.
class LoginBlock extends React.Component {
 constructor(props){
   super(props);
   this.state = {
     email: '',
     pword: '',
     msg: ''
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
      if (resp.status === 200) {
        console.log("success logging in,", resp.data);
        this.clear();
        // go to Doc page
        this.props.logIn();
      } else {
        console.log("error logging in", resp.data.err);
        this.setState({
          msg: resp.data.err
        })
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
      <div >
        <form style={{paddingTop: '3vh'}} className = "well">
          <h3 className="title"> Login </h3>
          <h2>{this.state.msg}</h2>
          <FormLine name="Email" type="text" value={this.state.email} onChange={(e)=> this.setState({
            email: e.target.value
          })}/>
          <FormLine name="Password" type="password" value={this.state.pword} onChange={(e)=> this.setState({
            pword: e.target.value
          })}/>
          <Button type="Login" onClick={()=>this.login()}/>
        </form>
        <div style={{paddingTop: '3vh'}}><button style={{ color: 'grey' }} type="button" className="btn btn-link btn-sm" onClick={()=>this.props.toggleReg()}>New user? Click here to register.</button></div>
      </div>
    );
  }
}


export default LoginBlock;
