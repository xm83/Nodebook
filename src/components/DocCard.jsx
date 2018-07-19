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
      <div className="container">
      <div className="col-sm-offset-2">
        <p>{this.props.doc.title}</p>
        <p> Owner: {this.props.doc.owner.firstName} {this.props.doc.owner.lastName} </p>
        <p> Collaboraters: {this.props.collabs} </p>
        <button type="button" className="btn btn-primary button" onClick={()=>this.props.openDoc()}>Open</button>
        <button style={{marginLeft: '1vw'}} type="button" className="btn btn-danger button" onClick={()=>this.props.deleteDoc()}>Delete</button>
      </div>
    </div>
    )
  }

}

export default DocCard;
