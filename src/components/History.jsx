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
      readOnly: true
    }
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

    axios.post(`http://localhost:1337/saveContent/${this.props.doc._id}`, {
      content: contents,
      style: styles,
    })
    .then((resp) => {
      if (resp.status === 200) {
        console.log('Reverted');
        this.props.cancel();
      }
    })
    .catch((err) => {
      console.log('Error: ', err);
    });
  }

  render() {
    return (
      <div>
        <h1>{this.state.name} History</h1>
        <div className="row">
          <div className="reader">
            <Editor
              customStyleMap={this.state.styleMap}
              editorState={this.state.editorState}
              readOnly={this.state.readOnly}
            />
          </div>
          <div>{this.state.versions.map(version => (<button
            key={version.date}
            onClick={() => { this.change(version.contents, version.style); }}
          >{version.date}</button>))}</div>
        </div>
        <Button onClick={() => this.revert()} type="Revert Changes" />
        <Button onClick={() => this.props.cancel() } type="Cancel" />
      </div>
    );
  }

}

export default History;
