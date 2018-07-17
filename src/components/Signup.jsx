import React, { Component } from 'react';
import FormLine from './FormLine';
import Button from './Button';
import Login from './Login';


//This component allows a new user to sign up and takes him directly to the
//Login Page, where they confirm their login works, and move onto the Main Hub

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      pword: "",
      confirmPword: ""
    }
  }

  Submit() {
    if (this.state.firstName &&
        this.state.lastName &&
        this.state.email &&
        this.state.pword &&
        this.state.confirmPword) {
      if (this.state.pword === this.state.confirmPword) {
        fetch(`${global.NGROK}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.pword,
          }),
        })
        .then((resp) => {
          if (resp.status === 200) {
            // Put the command to redirect to login here
          } else {
            console.log('error!');
          }
        })
        .catch((err) => {
          console.log('Error: ', err);
        });
      }
    }
  }


  render() {
    return (
      <form className="well">
        <h3 className="title"> Sign up </h3>
        <FormLine name = "FirstName" type = "text" value = {this.state.firstName} onChange={(e)=> this.setState({
          firstName: e.target.value
        })}/>
        <FormLine name = "LastName" type = "text" value = {this.state.lastName} onChange={(e)=> this.setState({
          lastName: e.target.value
        })}/>
        <FormLine name = "Email" type = "text" value = {this.state.email} onChange={(e)=> this.setState({
          email: e.target.value
        })} />
        <FormLine name = "Password" type = "password" value = {this.state.pword} onChange={(e)=> this.setState({
            pword: e.target.value
        })} />
        <FormLine name = "ConfirmPassword" type = "password" value = {this.state.confirmPword} onChange={(e)=> this.setState({
          confirmPword: e.target.value
        })}/>
        <Button type = "Submit" onClick={()=>this.Submit()}/>
        <Button type = "Return To Login" onClick={()=>this.props.toggleReg()}/>
      </form>
    );
  }
}

export default Signup;
