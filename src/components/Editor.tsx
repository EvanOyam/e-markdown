import React, { useState, useEffect } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import * as EasyMDE from 'easymde';
import * as path from 'path';
import * as fs from 'fs';
import { EditorProps } from '../typings/editor';

// todo fix: 分屏时闪烁的 bug

export default function Editor(props: EditorProps) {
  const { mdPath, textValue, handleChange, maxHeight, withoutBorder } = props;
  const [content, setContent] = useState('');

  useEffect(() => {
    (async () => {
      if (mdPath) {
        const basePath = path.join(__dirname, '..', 'assets', 'docs');
        const contentPath = path.join(basePath, `${mdPath}.md`);
        try {
          const mdContent =
            (await fs.promises.readFile(contentPath)).toString() || '';
          setContent(mdContent);
        } catch (error) {
          console.log('Loading todo content error: ', error);
        }
      } else {
        setContent(textValue || '');
      }
    })();
  }, []);

  const options: EasyMDE.Options = {
    autoDownloadFontAwesome: false,
    maxHeight: maxHeight || '200px',
    toolbar: [
      {
        name: 'custom',
        action: async (editor) => {
          try {
            const basePath = path.join(__dirname, '..', 'assets', 'docs');
            const contentPath = path.join(basePath, `${mdPath}.md`);
            await fs.promises.writeFile(contentPath, editor.value());
          } catch (error) {
            console.log('Override todo error: ', error);
          }
        },
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
      value={content}
    />
  );
}
