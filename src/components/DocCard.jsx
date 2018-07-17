import React from 'react';
import ReactDOM from 'react-dom';

//This Component is to create a Document Card with all the Document Information
class DocCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <div>
        <p>{this.props.doc.title}</p>
        <p> Owner: {this.props.doc.owner} </p>
        <p> Collaboraters: {this.props.doc.collaborators} </p>
      </div>
    )
  }

}

export default DocCard;
