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
      collaboratorNames: "",
    }
  }

  componentDidMount() {
    console.log(this.props.doc)
    axios.get(`http://localhost:1337/getAllEditors/` + this.props.doc._id)
    .then((res) => {
      let collabNames = []
      let collabs = res.data.project.collaborators.slice()
      for (var x = 0; x < collabs.length; x++) {
        let newName = collabs[x].firstName + ' ' + collabs[x].lastName
        collabNames.push(newName)
      }

      this.setState({
        ownerName: res.data.project.owner.firstName + ' ' + res.data.project.owner.lastName,
        collaboratorNames: collabNames
      })
    })
  }

  shouldComponentUpdate(prevProps, nextProps) {
    console.log(prevProps)
    console.log(nextProps)
    return true
  }

  render() {
    return (
      <div>
        <p>{this.props.doc.title}</p>
        <p> Owner: {this.state.ownerName} </p>
        <p> Collaboraters: {this.state.collaboratorNames} </p>
        <Button type="Open" onClick={()=>this.props.openDoc()} />
        <Button type="Delete" onClick={()=>this.props.deleteDoc()} />
      </div>
    )
  }

}

export default DocCard;
