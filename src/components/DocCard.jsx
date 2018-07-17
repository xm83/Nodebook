import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';

//This Component is to create a Document Card with all the Document Information
class DocCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    console.log(this.props.user)
    return (
      <div>
        <p>{this.props.doc.title}</p>
        <p> Owner: {this.props.user.firstName} {this.props.user.lastName} </p>
        <p> Collaboraters: {this.props.doc.collaborators} </p>
        <Button type="Open" onClick={()=>this.props.openDoc()} />
      </div>
    )
  }

}

export default DocCard;
