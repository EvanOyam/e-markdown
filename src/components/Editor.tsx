import React from 'react';
import SimpleMDE from 'react-simplemde-editor';
import * as EasyMDE from 'easymde';
import { EditorProps } from '../typings/editor';

// todo fix: 分屏时闪烁的 bug

export default function Editor(props: EditorProps) {
  const {
    textValue,
    handleChange,
    handleSave,
    maxHeight,
    withoutBorder,
  } = props;

  const options: EasyMDE.Options = {
    autoDownloadFontAwesome: false,
    maxHeight: maxHeight || '200px',
    toolbar: [
      {
        name: 'custom',
        action: (editor) => handleSave(editor.value()),
        className: 'far fa-save',
        title: 'Custom Button',
      },
      'preview',
      '|',
      'bold',
      'italic',
      'strikethrough',
      'heading',
      '|',
      'quote',
      'unordered-list',
      'ordered-list',
      'table',
      '|',
      'link',
      'image',
      '|',
      'side-by-side',
      'fullscreen',
      'guide',
    ],
  };

  const className = withoutBorder ? 'simple-mde-without-border' : '';
  return (
    <SimpleMDE
      className={className}
      options={options}
      onChange={handleChange}
      value={textValue}
    />
  );
}
