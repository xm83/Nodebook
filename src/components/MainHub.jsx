import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import FormLine from './FormLine';
import Modal from 'react-modal';
import Doc from './Doc';
import axios from 'axios'
import DocCard from './DocCard'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Draggable, Droppable } from 'react-drag-and-drop';

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

let docCards

Modal.setAppElement('#App')

//This Component Brings the User to the Main Hub of the page, where he/she can see all
//their documents

class MainHub extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      newDoc: "",
      openDoc: false,
      documents: [],
      search: "",
      filteredDocuments: [],
      currUser: "",
      loadDoc: "",
      idBeingDeleted: "",
    }

    this.openDoc= this.openDoc.bind(this)
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    axios.get(`http://localhost:1337/currentUser`)
    .then((user) => {
      this.setState({
        currUser: user.data
      })
    })
    axios.get(`http://localhost:1337/loaduserprojects/`, {
      params: {
        userid: this.state.currUser._id
      }
    })
    .then((resp) => {
      this.setState({
        documents: resp.data.projectObjects,
        filteredDocuments: resp.data.projectObjects,
      })
    })
    .catch((err) => {
      console.log(err)
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

  create = () => {
    if (this.state.newDoc) {
      axios.post(`http://localhost:1337/savenewdocument`, {
        title: this.state.newDoc,
      })
      .then((resp) => {
        if (resp.status === 200) {
          this.setState({
            openDoc: true,
            loadDoc: resp.data.projectObject,
            newDoc: ""
          })
        }
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
    }
  }

  goHome = () => {
    axios.get(`http://localhost:1337/loaduserprojects/`)
    .then((resp) => {
      console.log('frontend', resp.data)
      this.setState({
        filteredDocuments: resp.data.projectObjects,
        openDoc: false,
      });
      this.closeModal()
    })
    .catch((err) => {
      console.log(err)
    })
  }

  filter(e) {
    e.preventDefault();
    this.setState({
      search: e.target.value
    })
    let allDocs = this.state.documents.slice();
    let filtDocs = []
    allDocs.map(doc => {
      for (var x = 0; x < doc.collaborators.length; x++) {
        if (doc.collaborators[x].firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
            doc.collaborators[x].lastName.toLowerCase().includes(e.target.value.toLowerCase()) ||
           (doc.collaborators[x].firstName.toLowerCase() + ' ' + doc.collaborators[x].lastName.toLowerCase()).includes(e.target.value.toLowerCase())) {
          filtDocs.push(doc)
        }
      }
      if (!filtDocs.includes(doc) && (doc.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
          doc.owner.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
          doc.owner.lastName.toLowerCase().includes(e.target.value.toLowerCase()))) {
        filtDocs.push(doc)
      }
    })
    this.setState({
      filteredDocuments: filtDocs
    })
  }

  openDoc(docId) {
    axios.get(`http://localhost:1337/loadproject/` + docId)
    .then((proj) => {
      this.setState({
        openDoc: !this.state.openDoc,
        loadDoc: proj.data.projectObject
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  deleteDoc(docId) {
    axios.post(`http://localhost:1337/deletedoc`, {
      docId: docId,
      userId: this.state.currUser._id
    })
    .then((resp) => {
      this.setState({
        filteredDocuments: resp.data.projectObjects
      })
    })
    .catch((err) => {
      console.log(err)
    })
  }

  logOut() {
    axios.get(`http://localhost:1337/logout`)
    this.props.logOut()
  }


  sendData(docId) {
    this.setState({
      idBeingDeleted: docId
    })
  }

  onDrop() {
    this.deleteDoc(this.state.idBeingDeleted)
  }

  render() {
    let docRender;
    if (this.state.filteredDocuments) {
      docRender = this.state.filteredDocuments.map((doc, i) => {
        let collabNames = "";
        for (var x = 0; x < doc.collaborators.length; x++) {
          if (x === doc.collaborators.length-1) {
              collabNames += (doc.collaborators[x].firstName + ' ' + doc.collaborators[x].lastName)
          } else {
            collabNames += (doc.collaborators[x].firstName + ' ' + doc.collaborators[x].lastName + ', ')
          }
        }
        return <DocCard sendData={()=>this.sendData(doc._id)} collabs={collabNames} key={i} doc={doc} deleteDoc={()=>this.deleteDoc(doc._id)} openDoc={()=>this.openDoc(doc._id)} />
      })
    }
    return (this.state.openDoc ?
      // pass socket to Doc, which will render TextBox
      (<Doc doc={this.state.loadDoc} id={this.state.currUser} goHome={() => this.goHome()} socket={this.props.socket}/>)
      :
      (
        <div style={{background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
          <nav className="navbar navbar-light bg-light">
            <div>
            <a class="navbar-brand" href="#">NAME HERE</a>
              <button style={{marginLeft: '1vw'}} type="button" className="btn btn-outline-primary my-2 my-sm-0" onClick = {this.openModal}>Create New Doc</button>
            </div>
            <form className="form-inline">
              <input className="form-control mr-sm-2" aria-label="Search" type="text" placeholder="Search" onChange={(e)=> this.filter(e)}/>
              <button style={{marginLeft: '1vw'}} type="logout" className="btn btn-outline-dark my-2 my-sm-0" onClick = {()=>this.logOut()}>Logout</button>
            </form>
          </nav>
          <div>
            <Modal
              isOpen={this.state.modalIsOpen}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="New Document"
            >
              <h2 ref={subtitle => this.subtitle = subtitle}> New Document </h2>
              <Button type="Return" onClick={this.closeModal}/>
                <form className = "well">
                  <h3 className = "title"> Create New Document </h3>
                  <FormLine name = "Document Name" type = "text" value = {this.state.newDoc} onChange={(e)=> this.setState({
                    newDoc: e.target.value
                  })}/>
                  <Button type = "Create" onClick={()=>this.create()}/>
                </form>
              </Modal>
          </div>
          <div className="container" style={{display: 'flex', flexDirection:'row', flexWrap: 'wrap'}}>
          {docRender}
          </div>

            <div style={{position: 'absolute', bottom: 10, right: 10}}>
              <Droppable
                type={['document']}
                onDrop={this.onDrop.bind(this)}>
                <i className="fa fa-2x fa-trash"></i>
              </Droppable>
            </div>
        </div>
      )
    )
  }

}

export default MainHub;
