import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import FormLine from './FormLine';


class LoginBlock extends React.Component {
 constructor(props){
   super(props);
   this.state = {
     firstName: '',
     lastName: '',
     email: '',
     pword: '',
     confirmPword: '',
     reg: false
   }
 }

  login(){
    console.log(this.state);
    this.clear();
  }

  clear (){
   this.setState({
     firstName: '',
     lastName: '',
     email: '',
     pword: '',
     confirmPword: ''
    })
  }

 render(){
   return (
      <div>
        <div className="text-right" style={{paddingRight: '10px'}}><Button type = "Register" onClick={()=>this.props.toggleReg()}/></div>
        <form className = "well">
          <h3 className = "title"> Login </h3>
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
          <Button type = "Login" onClick={()=>this.login()}/>
        </form>
      </div>
    );
  }
}


export default LoginBlock;
