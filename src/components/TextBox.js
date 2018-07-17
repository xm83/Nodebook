import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { HuePicker } from 'react-color';


const styleMap = {
  right: {
    textAlign: 'right',
  },
  center: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
};

export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      color: '#fff',
      fontInput: 0,
      align: 'left',
    };
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

  font(fontSize) {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      fontSize,
    ));
  }

  align(side) {
    console.log(styleMap[side]);
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      side,
    ));
  }

  render() {
    return (
      <div id="textBox">
        <div id="textOptions">
          <button onClick={() => { this.bold(); }}><b>B</b></button>
          <button onClick={() => { this.italicize(); }}><i>I</i></button>
          <button onClick={() => { this.underline(); }}><u>U</u></button>
          <button onClick={() => { this.code(); }}>Code</button><br />
          <input
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                styleMap[String(e.target.value)] = { fontSize: e.target.value };
                this.font(String(e.target.value));
              }
            }
                  }
            onChange={(e) => {
              this.setState({ fontInput: e.target.value });
            }}
            type="number"
            value={this.state.fontInput}
          />
          <HuePicker
            color={this.state.color}
            onChangeComplete={(color) => {
              styleMap[String(color.hex)] = { color: color.hex };
              this.setState({ color: color.hex });
              this.toggleColor(String(color.hex));
            }}
          />
          <button onClick={() => { this.align('left'); }}>Left</button>
          <button onClick={() => { this.align('center'); }}>Center</button>
          <button onClick={() => { this.align('right'); }}>Right</button><br/>
          <button onClick={() => { this.setState({ align: 'left' }); }}> All Left </button>
          <button onClick={() => { this.setState({ align: 'center' }); }}> All Center </button>
          <button onClick={() => { this.setState({ align: 'right' }); }}> All Right </button>
        </div>
        <div className="editor">
          <Editor
            textAlignment={this.state.align}
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
