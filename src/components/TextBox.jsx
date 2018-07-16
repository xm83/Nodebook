import React from 'react';
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js';
import { HuePicker } from 'react-color';


const styleMap = {
  red: {
    color: 'rgba(255, 0, 0, 1.0)',
  },
  orange: {
    color: 'rgba(255, 127, 0, 1.0)',
  },
  yellow: {
    color: 'rgba(180, 180, 0, 1.0)',
  },
  green: {
    color: 'rgba(0, 180, 0, 1.0)',
  },
  blue: {
    color: 'rgba(0, 0, 255, 1.0)',
  },
  indigo: {
    color: 'rgba(75, 0, 130, 1.0)',
  },
  violet: {
    color: 'rgba(127, 0, 255, 1.0)',
  },
};

export default class TextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty(), toggledColor: '#fff' };
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
    const { editorState } = this.state;
    const selection = editorState.getSelection();
    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(styleMap)
      .reduce((contentState, color) =>
      Modifier.removeInlineStyle(contentState, selection, color),
      editorState.getCurrentContent());
    let nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'change-inline-style',
    );
    const currentStyle = editorState.getCurrentInlineStyle();
    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, color) =>
      RichUtils.toggleInlineStyle(state, color), nextEditorState);
    }
    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        toggledColor,
      );
    }
    this.onChange(nextEditorState);
  }
  render() {
    return (
      <div id="textBox">
        <div id="textOptions">
          <button onClick={() => { this.bold(); }}><b>B</b></button>
          <button onClick={() => { this.italicize(); }}><i>I</i></button>
          <button onClick={() => { this.underline(); }}><u>U</u></button>
          <button onClick={() => { this.code(); }}>Code</button>
          <HuePicker onChangeComplete={(color) => {
            console.log({ color: color.hex });
            this.toggleColor({ color: color.hex });
          }}
          />
          <select onChange={(e) => { this.toggleColor(e.target.value); }}>
            <option value="" disabled selected>Color</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="indigo">Indigo</option>
            <option value="violet">Violet</option>
          </select>
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
