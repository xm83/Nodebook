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
      email: ""
    }

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
        if (resp.status === 200) {
          this.setState({
            shareUserId: "",
          })
        }
        console.log(resp)
        this.closeModal()
      })
    })
    .catch((err) => {
      console.log('Error: ', err);
    })
  }

  render(){
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
            <h2 ref={subtitle => this.subtitle = subtitle}> Share Your Document </h2>
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
        <TextBox/>
      </div>
    )
  }
}

export default Doc;
