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
    console.log('MINE', this.props.doc.contents)
    return (
      <Draggable type="document" onMouseDown={()=>this.props.sendData()}>
        <div onClick={()=>this.props.openDoc()} className=" doc-card text-center d-inline-block"
            style={{marginTop: '3vh', marginLeft: '1vw',
            marginRight: '1vw', height: '35vh', width: '15vw'}}>
          <div style={{background: 'white', display: 'flex', flex: '1', flexDirection: 'column', height: '100%'}}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px', flex: '2'}}>
              <div style={{fontSize: '8px'}}>{this.props.doc.contents[17]}</div>
            </div>
            <div style={{borderTop: '1px solid grey', fontSize: '12px', flex: '1'}}>
              <div style={{paddingTop: '2vh'}}>{this.props.doc.title}</div>
              <div>{new Date(this.props.doc.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </Draggable>
    )
  }

}



export default DocCard;
