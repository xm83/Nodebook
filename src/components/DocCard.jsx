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
      <div onClick={()=>this.props.openDoc()} className="text-center d-inline-block"
        style={{marginTop: '3vh', marginLeft: '1vw',
        marginRight: '1vw', border: '2px solid black', background: 'white', height: '35vh', width: '15vw'}}>
      <div style={{background: 'linear-gradient(to top, #dfe9f3 0%, white 100%)', display: 'flex', flex: '1', flexDirection: 'column', height: '100%'}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '30px', flex: '2'}}>
          <div>{this.props.doc.title}</div>
        </div>
        <div style={{fontSize: '12px', flex: '1'}}>
          <div> {this.props.doc.owner.firstName} {this.props.doc.owner.lastName} </div>
          <div>{new Date(this.props.doc.createdAt).toLocaleDateString()}</div>
          {/* <button style={{color: 'grey'}} type="button" className="btn btn-sm btn-link button" onClick={(e)=>{
            e.stopPropagation()
            this.props.deleteDoc()
          }}>Delete</button> */}
        </div>
      </div>
    </div>
    )
  }

}

export default DocCard;
