import React from 'react';
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js';
import { HuePicker } from 'react-color';


const styleMap = {};

export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty(), color: '#fff' };
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


  toggleColor(toggledColor) {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      toggledColor,
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
          <HuePicker
            color={this.state.color}
            onChangeComplete={(color) => {
              styleMap[String(color.hex)] = { color: color.hex };
              this.setState({ color: color.hex });
              this.toggleColor(String(color.hex));
            }}
          />
        </div>
        <div className="editor">
          <Editor
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
