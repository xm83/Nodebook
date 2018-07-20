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
    console.log('Content', this.props.doc.contents)
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
        collaborators: resp.data.collaborators.collaborators,
        reverted: false,
      })
    })
  }


  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal = () => {
    ;
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
    console.log(this.state.newContent)
    console.log(this.state.newStyle)
    this.setState({
      versionDisplay: true
    })
  }

  changeDoc() {
    axios.get(`http://localhost:1337/loadproject/` + this.props.doc._id)
    .then((proj) => {
      this.setState({
        newContent: proj.data.projectObject.contents,
        newStyle: proj.data.projectObject.styles,
        versionDisplay: false
      })
    })
    .catch((err) => {
      console.log(err)
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
        <li className="Collabs">
          {collab.firstName} {collab.lastName} <Button type="Remove" onClick={() => this.removeColl(collab._id)} />
        </li>
      )
    });

    return (!this.state.versionDisplay ?
      (<div style={{height: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
        <nav className="navbar" style={{background: 'white'}}>
          <div>
            <a className="navbar-brand" onClick={() => this.props.goHome()} href="#">
              <img style={{height: '40px'}} className = 'navLogo' src={'https://i.imgur.com/EeRNcBe.png'} alt={'cant get image'} width='70'/>
            </a>
          </div>
          <form className="form-inline">
            {/* <Button type="Version History" onClick={() => this.showVersions()} revert={()=>this.revert()} /> */}
            <button style={{marginRight: '1vw'}} type="button" className="btn btn-outline-primary my-2 my-sm-0" onClick={() => this.showVersions()} revert={()=>this.revert()}>History</button>
            <button type="button" className="btn btn-outline-primary my-2 my-sm-0" onClick={this.openModal}>Share</button>
          </form>
        </nav>
        <h1 className="text-center"> {this.props.doc.title} </h1>
        {/* <Button type="Home" onClick={()=>this.props.goHome()}/> */}
        <div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Share Your Document"
          >
            <form className="well">
              <h5 className="shareHeader"> Users On This Document </h5>
              <ul>
                {collabNames}
              </ul>
              <div classname="input-group-text">
              <hr />
              <p>Add New User</p>
              <input type='text' className="form-control emailInput" placeholder='Email' value={this.state.email}
                onChange={(e)=>this.setState({email: e.target.value})}></input>
              </div>
              <div className="modalButtons">
                <Button type = "Share" onClick={this.share}/>
                <Button type="Cancel" onClick={this.closeModal}/>
              </div>
            </form>
          </Modal>
        </div>
        <center><TextBox docId={this.props.doc._id} content={this.state.newContent} styles={this.state.newStyle} socket={this.props.socket}/></center>
        </div>) :
      (<History goHome={()=> this.props.goHome()} changeDoc={()=> this.changeDoc()} doc={this.props.doc} cancel={()=>this.cancel()}/>)
    )
  }
}

export default Doc;
