import React from 'react';
import { Editor, EditorState, RichUtils, Modifier, convertToRaw } from 'draft-js';
import { HuePicker } from 'react-color';
// import 'draft-js/dist/Draft.css';


const styleMap = {};
const blockStyles = [
  { style: 'header-one', title: 'H1' },
  { style: 'header-two', title: 'H2' },
  { style: 'header-three', title: 'H3' },
  { style: 'header-four', title: 'H4' },
  { style: 'header-five', title: 'H5' },
  { style: 'header-six', title: 'H6' },
  { style: 'blockquote', title: 'Quote' },
  { style: 'text-align-left', title: 'Left' },
  { style: 'text-align-center', title: 'Center' },
  { style: 'text-align-right', title: 'Right' },
  { style: 'ordered-list-item', title: 'Numbered List' },
  { style: 'unordered-list-item', title: 'Bullet Points' },

];

function getBlockStyle(block) {
  const type = block.getType();
  return (type.indexOf('text-align-') === 0) ? type : null;
}

export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      color: '#fff',
      fontInput: 0,
    };
    this.onChange = editorState => {
      this.setState({ editorState });
    };
  }


  inline(inline) {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      inline,
    ));
  }

  block(block) {
    this.onChange(RichUtils.toggleBlockType(
      this.state.editorState,
      block,
    ));
  }

  clear() {
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    styleMap.BOLD = '';
    styleMap.UNDERLINE = '';
    styleMap.ITALIC = '';
    styleMap.CODE = '';
    const clearContentState = Object.keys(styleMap)
            .reduce(
              (contentState, style) => Modifier.removeInlineStyle(contentState, selection, style),
              editorState.getCurrentContent(),
          );
    const newEditorState = EditorState.push(
            editorState,
            clearContentState,
            'change-inline-style',
          );
    const newUnstyledEditorState = RichUtils.toggleBlockType(
      newEditorState,
      'unstyled',
    );

    this.onChange(newUnstyledEditorState);
  }
  render() {
    return (
      <div id="textBox">
        <div id="textOptions">
          {blockStyles.map(({ style, title }) =>
          (<button key={title} onClick={() => { this.block(style); }}>{title}</button>))}
          <br />
          <button onClick={() => { this.inline('BOLD'); }}><b>B</b></button>
          <button onClick={() => { this.inline('ITALIC'); }}><i>I</i></button>
          <button onClick={() => { this.inline('UNDERLINE'); }}><u>U</u></button>
          <button onClick={() => {
            this.inline('CODE'); this.block('code-block');
          }}
          >Code</button>
          <button onClick={() => {
            this.clear();
          }}
          >Default</button>
          <input
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                styleMap[String(e.target.value)] = { fontSize: e.target.value };
                this.inline(String(e.target.value));
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
              this.inline(String(color.hex));
            }}
          />
        </div>
        <div className="editor">
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
