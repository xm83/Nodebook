import React from 'react';
import ReactDOM from 'react-dom';

function Button(props){
  return (<button type="button" className="btn btn-dark button" onClick = {props.onClick}>{props.type}</button>)
}

export default Button
