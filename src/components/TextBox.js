import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { HuePicker } from 'react-color';
// import 'draft-js/dist/Draft.css';


const styleMap = {
  left: {
    textDecoration: {
      textAlign: 'center',
    },
  },
  center: {
    textDecoration: {
      textAlign: 'center',
    },
  },
  right: {
    textDecoration: {
      textAlign: 'right',
    },
  },
};

export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      color: '#fff',
      fontInput: 0,
    };
    this.onChange = editorState => this.setState({ editorState });
  }
  onTab(e) {
    this.onChange(RichUtils.onTab(
      e,
      this.state.editorState,
      4,
    ));
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

  block(block) {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      block,
    ));
  }

  render() {
    return (
      <div id="textBox">
        <div id="textOptions">
          <button onClick={() => { this.block('header-one'); }}>h1</button>
          <button onClick={() => { this.block('header-two'); }}>h2</button>
          <button onClick={() => { this.block('header-three'); }}>h3</button>
          <button onClick={() => { this.block('header-four'); }}>h4</button>
          <button onClick={() => { this.block('header-five'); }}>h5</button>
          <button onClick={() => { this.block('header-six'); }}>h6</button>
          <button onClick={() => { this.block('blockquote'); }}>Blockquote</button>
          <button onClick={() => { this.block('unstyled'); }}>Clear Block Styling</button><br />

          <button onClick={() => { this.bold(); }}><b>B</b></button>
          <button onClick={() => { this.italicize(); }}><i>I</i></button>
          <button onClick={() => { this.underline(); }}><u>U</u></button>
          <button onClick={() => { this.code(); this.block('code-block'); }}>Code</button><br />
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
          <button onClick={() => { this.align('right'); }}>Right</button><br />
          <button onClick={() => { this.block('ordered-list-item'); }}>Numbered List</button>
          <button onClick={() => { this.block('unordered-list-item'); }}>Bullet Points</button>
        </div>
        <div className="editor">
          <Editor
            // spellCheck=true
            onTab={(e) => { this.onTab(e) }}
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
