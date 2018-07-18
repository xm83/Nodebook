import React from 'react';
import axios from 'axios';
import { Editor, EditorState, convertFromRaw } from 'draft-js';

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
    // console.log('text', text);
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
    console.log(this.state.styleMap, this.state.editorState);
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
        <button onClick={() => { this.revert() }}> Revert Changes </button>
      </div>
    );
  }

}

export default History;
