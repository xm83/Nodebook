import React, { Component } from 'react';
import FormLine from './FormLine.js';
import Button from './Button.js';
// import models from './models/models';
// var User = models.User;
import Login from './Login.js';
// var Doc = models.Doc;


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

  // Submit() {
  //   if (this.state.firstName && this.state.lastName && this.state.email && this.state.pword && this.state.confirmPword) {
  //     if (this.state.pword === this.state.confirmPword) {
  //       let newUser = new User({
  //         email: this.state.email,
  //         firstName: this.state.firstName,
  //         lastName: this.state.lastName,
  //         password: this.state.pword,
  //         docs: []
  //       }).save()
  //       .then((user) => {
  //         console.log(user)
  //       })
  //       .catch(function(error) {
  //         console.log('Error', error)
  //       })
  //     }
  //   }
  // }


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
          })}/>
          <FormLine name = "Password" type = "password" value = {this.state.pword} onChange={(e)=> this.setState({
            pword: e.target.value
          })}/>
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
