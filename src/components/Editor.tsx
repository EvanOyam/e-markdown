import React, { useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import { EditorProps } from '../typings/editor';

// todo fix 分屏时闪烁的 bug

export default function Editor(props: EditorProps) {
  const { initValue, maxHeight, withoutBorder } = props;
  const [textValue, setTextValue] = useState(initValue);
  const handleChange = (value: string) => {
    setTextValue(value);
  };

  const options = {
    autoDownloadFontAwesome: false,
    maxHeight: maxHeight || '200px',
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
