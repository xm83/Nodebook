import React from 'react';
import axios from 'axios';
import { Editor, EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import Button from './Button'

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      styleMap: {},
      versions: [],
      current: {},
      name: '',
      owner: '',
      readOnly: true,
      orig: '',
    };
    this.onChange = (editorState) => {
      this.setState({ editorState });
    };
  }

  componentDidMount() {
    axios.get(`http://localhost:1337/loadproject/${this.props.doc._id}`)
    .then((res) => {
      const versions = res.data.projectObject.versions;
      const current = versions[versions.length - 1];
      const name = res.data.projectObject.title;
      const owner = res.data.projectObject.ownerName;
      let styles = {};
      if (current.style) {
        styles = JSON.parse(current.style);
      }
      const text = convertFromRaw(JSON.parse(current.contents));
      this.setState({
        editorState: EditorState.createWithContent(text),
        styleMap: styles,
        versions,
        current,
        name,
        owner,
        orig: JSON.parse(current.contents),
      });
    });
  }

  change(contents, style) {
    const text = convertFromRaw(JSON.parse(contents));
    let styles = {};
    if (style) {
      styles = JSON.parse(style);
    }
    this.setState({
      editorState: EditorState.createWithContent(text),
      styleMap: styles,
    });
  }

  revert(){
    const { editorState } = this.state;
    const raw = convertToRaw(editorState.getCurrentContent());
    const contents =  JSON.stringify(raw);
    const styles = JSON.stringify(this.state.styleMap);
    axios.post(`http://localhost:1337/revert/${this.props.doc._id}`, {
      content: contents,
      style: styles,
    })
    .then((resp) => {
      if (resp.status === 200) {
        this.props.changeDoc()
      }
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
  }

  changes() {
    const { editorState, orig } = this.state;
    const raw = convertToRaw(editorState.getCurrentContent());
    const changes = [];
    if (orig === '') return changes;
    raw.blocks.forEach((block) => {
      let matched = false;
      orig.blocks.forEach((origBlock) => {
        if (block.key === origBlock.key && !matched) {
          matched = true;
          if (block.text !== origBlock.text) {
            const change = `"${origBlock.text}" was changed to "${block.text}"`;
            changes.push(change);
          }
        }
      });
      let newChange = `"${block.text}" was added`;
      if (block.text === '') {
        newChange = 'New line added';
      }
      changes.push(newChange);
    });

    orig.blocks.forEach((origBlock) => {
      let matched = false;
      raw.blocks.forEach((block) => {
        if (block.key === origBlock.key && !matched) {
          matched = true;
        }
      });
      let newChange = `"${origBlock.text}" was deleted`;
      if (origBlock.text === '') {
        newChange = 'New line removed';
      }
      changes.push(newChange);
    });
    return changes;
  }
  render() {
    const changes = this.changes();
    return (
      <div>
        <nav className="navbar" style={{background: 'white'}}>
          <div>
            <a className="navbar-brand" onClick={() => this.props.goHome()} href="#">
              <img style={{height: '40px'}} className = 'navLogo' src={'https://i.imgur.com/VpF5stX.png'} alt={'cant get image'} width='70'/>
            </a>
          </div>
          <form className="form-inline">
            {/* <Button type="Version History" onClick={() => this.showVersions()} revert={()=>this.revert()} /> */}
            <button style={{marginRight: '1vw'}} type="button" className="btn btn-outline-primary my-2 my-sm-0" onClick={() => this.props.cancel()}>Back</button>
            <button type="button" className="btn btn-outline-primary my-2 my-sm-0" onClick={this.openModal}>Share</button>
          </form>
        </nav>
        <center><h1>{this.state.name} History</h1></center>
        <div className="row">
          <div className="reader">
            <Editor
              customStyleMap={this.state.styleMap}
              editorState={this.state.editorState}
              readOnly={this.state.readOnly}
            />
          </div>
          <div className="container" style={{display: 'flex', flexDirection:'row', flexWrap: 'wrap', paddingTop: '8vh', paddingBottom: '4vh'}}>{this.state.versions.map(version => (<button
            className="text-center d-inline-block"
            style={{ marginTop: '3vh', marginLeft: '1vw', marginRight: '1vw', height: '7vh', width: '15vw' }}
            key={version.date}
            onClick={() => { this.change(version.contents, version.style); }}
          >{version.date}</button>))}</div>
        </div>
        <div className="row">
          <h3>Differences from Current</h3>
          <div>
            {changes.map(change => (
              <p>{change}</p>
            ))}
          </div>
        </div>
        <Button onClick={() => this.revert()} type="Revert Changes" />
      </div>
    );
  }

}

export default History;
