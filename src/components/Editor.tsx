import React from 'react';
import SimpleMDE from 'react-simplemde-editor';
import * as EasyMDE from 'easymde';
import { EditorProps, ToolbarButton } from '../typings/editor';

// todo fix: 分屏时闪烁的 bug

export default function Editor(props: EditorProps) {
  const {
    textValue,
    handleChange,
    handleSave,
    handleMap,
    maxHeight,
    withoutBorder,
    mindmap,
  } = props;

  const options: EasyMDE.Options = {
    autoDownloadFontAwesome: false,
    maxHeight: maxHeight || '200px',
  };

  const toolbar: Array<
    '|' | ToolbarButton | EasyMDE.ToolbarIcon | EasyMDE.ToolbarDropdownIcon
  > = [
    {
      name: 'save',
      action: (editor) => handleSave(editor.value()),
      className: 'far fa-save',
      title: 'Save',
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
  ];

  if (mindmap) {
    const mindMapOptions = {
      name: 'mindmap',
      action: handleMap ? () => handleMap() : () => {},
      className: 'fas fa-network-wired',
      title: 'Mindmap',
    };
    toolbar.splice(1, 0, mindMapOptions);
  }

  options.toolbar = toolbar;

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
