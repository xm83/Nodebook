import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Button from './Button';
import FormLine from './FormLine';
import TextBox from './TextBox';
import axios from 'axios'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#App')

//This document is loaded based on an id, and will load all the information based on that

class Doc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      shareUserId: "",
      email: "",
      collaborators: []
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    axios.post(`http://localhost:1337/populateCollaborators`, {
      docId: this.props.doc._id
    })
    .then((resp) => {
      this.setState({
        collaborators: resp.data.collaborators.collaborators
      })
    })
  }


  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal = () => {
    this.subtitle.style.color = '#f00';
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  share = () => {
    axios.get(`http://localhost:1337/findUser/` + this.state.email)
    .then((user) => {
      this.setState({
        shareUserId: user.data.shareUser._id
      })
      console.log(user.data.shareUser._id)
      axios.post(`http://localhost:1337/savenewcollaborator`, {
        newCollaborator: this.state.shareUserId,
        projectId: this.props.doc._id
      })
      .then((resp) => {
        console.log(resp.data)
        this.setState({
          email: "",
          collaborators: resp.data.collaborators.collab
        })
        if (resp.data.status === 200) {
          this.closeModal()
        }
        if (resp.data.status === 202) {

          alert('This User Already Has Access To The Document')
        }
      })
    })
    .catch((err) => {
      console.log('Error: ', err);
    })
  }

  removeColl(id) {
    axios.post(`http://localhost:1337/removecollaborator`, {
      projectId: this.props.doc._id,
      collaboratorToBeRemoved: id
    })
    .then((resp) => {
      console.log(resp)
      axios.post(`http://localhost:1337/populateCollaborators`, {
        docId: this.props.doc._id
      })
      .then((resp) => {
        this.setState({
          collaborators: resp.data.collaborators.collaborators
        })
      })
    })
  }



  render(){
    let collabNames = this.state.collaborators.map((collab) => {
      console.log(collab)
      console.log(this.state.collaborators)
      return (
        <li>
          {collab.firstName} {collab.lastName} <Button type="Remove" onClick={() => this.removeColl(collab._id)} />
        </li>
      )
    });

    return (
      <div>
        <h1> {this.props.doc.title} </h1>
        <Button type="Home" onClick={()=>this.props.goHome()}/>
        <div>
          <Button type="Share" onClick={this.openModal}/>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Share Your Document"
          >
            <h2 ref={subtitle => this.subtitle = subtitle}> Users On This Document </h2>
              <ul>
                {collabNames}
              </ul>
              <form className = "well">
                <h3 className = "title"> Users To Share With </h3>
                <FormLine name = "Email" type = "text" value = {this.state.email} onChange={(e)=> this.setState({
                  email: e.target.value
                })}/>
                <Button type = "Share" onClick={this.share}/>
                <Button type="Cancel" onClick={this.closeModal}/>
              </form>
            </Modal>
        </div>
        <TextBox docId={this.props.doc._id} content={this.props.doc.contents} styles={this.props.doc.styles}/>
      </div>
    )
  }
}

export default Doc;
