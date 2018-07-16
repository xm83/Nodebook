import React from 'react';
import ReactDOM from 'react-dom';


function FormLine(props){
  return (<div className="col-sm-5">
            <div className="input-group mb-2">
              <div className="input-group-prepend">
                <div className="input-group-text">{props.name}</div>
              </div>
              <input type={props.type} className="form-control" placeholder={props.name}
                value = {props.value} onChange = {props.onChange} required></input>
            </div>
          </div>)
}

export default FormLine
