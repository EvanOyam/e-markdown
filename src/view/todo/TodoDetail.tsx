import React, { useState, useEffect } from 'react';
import * as path from 'path';
import * as fs from 'fs';
import { message } from 'antd';
import Editor from '../../components/Editor';
import { TodoDetailProps } from '../../typings/todo';

export default function TodoDetail(props: TodoDetailProps) {
  const { todoId } = props;
  const [mdContent, setMdContent] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const dirPath = path.join(
          __dirname,
          '..',
          'assets',
          'docs',
          'markdown'
        );
        const mdPath = path.join(dirPath, `${todoId}.md`);
        const text = (await fs.promises.readFile(mdPath)).toString() || '';
        setMdContent(text);
      } catch (error) {
        message.error('文件可能已损坏，加载失败');
        console.log('Loading todo detail error: ', error);
      }
    })();
  }, []);

  const handleSave = async (text: string) => {
    try {
      const dirPath = path.join(__dirname, '..', 'assets', 'docs', 'markdown');
      const mdPath = path.join(dirPath, `${todoId}.md`);
      await fs.promises.writeFile(mdPath, text);
    } catch (error) {
      message.error('文件可能已损坏，保存失败');
      console.log('Override todo error: ', error);
    }
  };

  return (
    <Editor
      textValue={mdContent}
      handleSave={handleSave}
      handleChange={() => {}}
    />
  );
}
