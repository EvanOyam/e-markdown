import React, { useState } from 'react';
import SimpleMDE from 'react-simplemde-editor';

interface EditorProps {
  initValue: string;
}
export default function Editor(props: EditorProps) {
  const { initValue } = props;
  const [textValue, setTextValue] = useState(initValue);
  const handleChange = (value: string) => {
    setTextValue(value);
  };
  return (
    <SimpleMDE
      options={{ autoDownloadFontAwesome: false }}
      onChange={handleChange}
      value={textValue}
    />
  );
}
