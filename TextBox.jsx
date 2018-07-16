import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
  }
  bold() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'BOLD',
    ));
  }
  italicize() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'ITALIC',
    ));
  }
  underline() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'UNDERLINE',
    ));
  }
  code() {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'CODE',
    ));
  }
  render() {
    return (
      <div id="textBox">
        <div id="textOptions">
          <button onClick={() => { this.bold(); }}><b>B</b></button>
          <button onClick={() => { this.italicize(); }}><i>I</i></button>
          <button onClick={() => { this.underline(); }}><u>U</u></button>
          <button onClick={() => { this.code(); }}>Code</button>
        </div>
        <div className="editor">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
