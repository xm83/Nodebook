import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import FormLine from './FormLine';


//This component is the actual form itself.
class LoginBlock extends React.Component {
 constructor(props){
   super(props);
   this.state = {
     email: '',
     pword: ''
   }
 }

  login(){
    console.log(this.state);
    //ADD PASSPORT HERE!
    this.clear();
    this.props.logIn()
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
          <Button type = "Login" onClick={()=>this.logIn()}/>
        </form>
      </div>
    );
  }
}


export default LoginBlock;
