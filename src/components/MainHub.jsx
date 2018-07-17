import React from 'react';
import ReactDOM from 'react-dom';
import Button from './Button';
import FormLine from './FormLine';
import Modal from 'react-modal';
import Doc from './Doc';
import axios from 'axios'
import DocCard from './DocCard'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

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
      loadDoc: ""
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
      console.log(resp.data)
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
        owner: this.state.currUser._id
      })
      .then((resp) => {
        if (resp.status === 200) {
          this.setState({
            openDoc: true,
            loadDoc: resp.data.projectObject
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
        documents: resp.data.projectObjects,
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
    console.log(e.target.value)
    let allDocs = this.state.documents.slice();

    console.log(allDocs)
    let filtDocs = allDocs.filter(doc => doc.title.includes(e.target.value))
    this.setState({
      filteredDocuments: filtDocs
    })
  }

  openDoc(docId) {
    axios.get(`http://localhost:1337/loadproject/` + docId)
    .then((proj) => {
      console.log(proj.data)
      this.setState({
        openDoc: !this.state.openDoc,
        loadDoc: proj.data.projectObject
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

  render() {
    let docRender;
    if (this.state.filteredDocuments) {
      docRender = this.state.filteredDocuments.map((doc, i) => <DocCard key={i} user={this.state.currUser} doc={doc} openDoc={()=>this.openDoc(doc._id)} /> )
    }
    return (this.state.openDoc ?
      (<Doc doc={this.state.loadDoc} id={this.state.currUser} goHome={() => this.goHome()} />)
      :
      (
        <div>
          <div>
            <Button type="Create New Doc" onClick={this.openModal}/>
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
          <input type="text" placeholder="Search.." onChange={(e)=> this.filter(e)}/>
          {docRender}
          <Button type="Logout" onClick={()=>this.logOut()}/>
        </div>
      )
    )
  }

}

export default MainHub;
