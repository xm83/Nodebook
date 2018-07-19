import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import axios from 'axios'
import History from './History'
import Button from './Button';
import FormLine from './FormLine';
import TextBox from './TextBox';

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
      collaborators: [],
      versionDisplay: false,
      reverted: false,
      newContent: this.props.doc.contents,
      newStyle: this.props.doc.styles,
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    axios.post(`http://localhost:1337/populateCollaborators`, {
      docId: this.props.doc._id
    })
    .then((resp) => {
      this.setState({
        collaborators: resp.data.collaborators.collaborators,
        reverted: false,
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
        axios.post(`http://localhost:1337/populateCollaborators`, {
          docId: this.props.doc._id
        })
        .then((resp) => {
          this.setState({
            email: "",
            collaborators: resp.data.collaborators.collaborators
          })
          if (resp.data.status === 200) {
            this.closeModal()
          }
          if (resp.data.status === 202) {

            alert('This User Already Has Access To The Document')
          }
        })
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
      if (resp.data.status === 200) {
        axios.post(`http://localhost:1337/populateCollaborators`, {
          docId: this.props.doc._id
        })
        .then((resp) => {
          this.setState({
            collaborators: resp.data.collaborators.collaborators
          })
        })
      } else {
        alert(resp.data.message)
      }
    })
  }

  showVersions() {
    this.setState({
      versionDisplay: true
    })
  }

  revert() {
    axios.get(`http://localhost:1337/loadproject/` + docId)
    .then((proj) => {
      this.setState({
        openDoc: !this.state.openDoc,
        loadDoc: proj.data.projectObject
      })
    })
  }

  cancel() {
    this.setState({
      versionDisplay: false
    })
  }

  render(){
    let collabNames = this.state.collaborators.map((collab) => {
      return (
        <li>
          {collab.firstName} {collab.lastName} <Button type="Remove" onClick={() => this.removeColl(collab._id)} />
        </li>
      )
    });

    return (!this.state.versionDisplay ?
      (<div>
        <nav className="navbar navbar-light bg-light">
          <div>
          <a class="navbar-brand" onClick={()=>this.props.goHome()} href="#">NAME HERE</a>
          </div>
          <form className="form-inline">
            {/* <Button type="Version History" onClick={() => this.showVersions()} revert={()=>this.revert()} /> */}
            <button type="button" className="btn btn-primary my-2 my-sm-0" onClick={() => this.showVersions()} revert={()=>this.revert()}>History</button>
            <button type="button" className="btn btn-primary my-2 my-sm-0" onClick={this.openModal}>Share</button>
          </form>
        </nav>
        <h1> {this.props.doc.title} </h1>
        {/* <Button type="Home" onClick={()=>this.props.goHome()}/> */}
        <div>
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
        <TextBox docId={this.props.doc._id} content={this.props.doc.contents} styles={this.props.doc.styles} socket={this.props.socket}/>
        <Button type="Version History" onClick={() => this.showVersions()} revert={()=>this.revert()} />
      (<History doc={this.props.doc} cancel={() => this.cancel()} revert={() => this.revert()}/>)
    )
  }
}

export default Doc;
