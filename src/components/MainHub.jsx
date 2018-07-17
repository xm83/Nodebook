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
      openId: "",
      documents: [],
      search: "",
      filteredDocuments: [],
      dropdownOpen: false,
      currUser: ""
    }

    this.toggle = this.toggle.bind(this)
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
        console.log(resp)
        if (resp.status === 200) {
          this.setState({
            openDoc: true,
            openId: resp.data.id
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

  toggle() {
    this.setState({
      dropDownOpen: !this.state.dropdownOpen
    })
  }

  render() {
    let docRender;
    if (this.state.filteredDocuments) {
      docRender = this.state.filteredDocuments.map((doc, i) => <DocCard user={this.state.currUser} doc={doc} /> )
    }
    return (this.state.openDoc ?
      (<Doc id={this.state.currUser} goHome={() => this.goHome()} />)
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
          {/* <ButtonDropdown direction=isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              Sort By
            </DropdownToggle>
            <DropdownMenu>
               <DropdownItem header>Choose One</DropdownItem>
               <DropdownItem>A to Z</DropdownItem>
               <DropdownItem divider />
               <DropdownItem>Z to A</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown> */}
          <input type="text" placeholder="Search.." onChange={(e)=> this.filter(e)}/>
          {docRender}
        </div>
      )
    )
  }

}

export default MainHub;
