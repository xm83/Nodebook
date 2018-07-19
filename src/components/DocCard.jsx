import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import axios from 'axios';
import { Draggable, Droppable } from 'react-drag-and-drop';

//This Component is to create a Document Card with all the Document Information
class DocCard extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Draggable type="document" onClick={()=>this.props.sendData()}>
        <p>{this.props.doc.title}</p>
        <p> Owner: {this.props.doc.owner.firstName} {this.props.doc.owner.lastName} </p>
        <p> Collaboraters: {this.props.collabs} </p>
        <Button type="Open" onClick={()=>this.props.openDoc()} />
        <Button type="Delete" onClick={()=>this.props.deleteDoc()} />
      </Draggable>
    )
  }

}

export default DocCard;
