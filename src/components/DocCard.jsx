import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import axios from 'axios'

//This Component is to create a Document Card with all the Document Information
class DocCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ownerName: "",
      collaboratorNames: [],
    }
  }

  componentDidMount() {
    axios.get(`http://localhost:1337/getAllEditors/` + this.props.doc._id)
    .then((res) => {
      this.setState({
        ownerName: res.data.project.owner.firstName + ' ' + res.data.project.owner.lastName,
      })      
      console.log(res.data)
    })
  }

  render() {
    return (
      <div>
        <p>{this.props.doc.title}</p>
        <p> Owner: {this.state.ownerName} </p>
        <p> Collaboraters: {this.props.doc.collaborators} </p>
        <Button type="Open" onClick={()=>this.props.openDoc()} />
      </div>
    )
  }

}

export default DocCard;
