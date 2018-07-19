import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import axios from 'axios'

//This Component is to create a Document Card with all the Document Information
class DocCard extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div onClick={()=>this.props.openDoc()} className="text-center d-inline-block" style={{marginTop: '3vh', marginLeft: '1vw', marginRight: '1vw', border: '2px solid black', background: 'white', height: '35vh', width: '15vw'}}>
      <div style={{flexDirection: 'row'}}>
        <div style={{fontSize: '30px'}}>
          <p>{this.props.doc.title}</p>
        </div>
        <div>
          <p style={{color: '#c0c0c0'}}> {this.props.doc.owner.firstName} {this.props.doc.owner.lastName} </p>
          <p> {this.props.collabs} </p>
          <p>{this.props.doc.createdAt}</p>
          <button style={{color: 'grey'}} type="button" className="btn btn-sm btn-link button" onClick={()=>this.props.deleteDoc()}>Delete</button>
        </div>
      </div>
    </div>
    )
  }

}

export default DocCard;
