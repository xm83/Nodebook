import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Button from './Button';
import FormLine from './FormLine';

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

class Doc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
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



  render(){
    return (
      <div>
        <Button type="Home" onClick={()=>this.goHome()}/>
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
            <Button type="Return" onClick={this.closeModal}/>
              <form className = "well">
                <h3 className = "title"> Users To Share With </h3>
                <FormLine name = "Email" type = "text" value = {this.state.email} onChange={(e)=> this.setState({
                  email: e.target.value
                })}/>
                <Button type = "Share" onClick={()=>this.share()}/>
              </form>
            </Modal>
        </div>
      </div>
    )
  }
}

export default Doc;
