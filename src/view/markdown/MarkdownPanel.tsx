import styled from '@emotion/styled';
import React, { useContext, useEffect, useState } from 'react';
import * as path from 'path';
import * as fs from 'fs';
import { message } from 'antd';
import Editor from '../../components/Editor';
import { MdContext } from '../../context/markdownContext';
import Empty from '../../components/Empty';

const MarkdownPanelWrapper = styled.div`
  flex: 1;
  background-color: #272b31;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: scroll;
  height: 100vh;
  padding: 16px;
`;

export default function MarkdownPanel() {
  const { state } = useContext(MdContext);
  const [mdContent, setMdContent] = useState('');

  useEffect(() => {
    if (!state.openMdId) return;
    (async () => {
      try {
        const mdPath = path.join(
          __dirname,
          '..',
          'assets',
          'docs',
          'markdown',
          `${state.openMdId}.md`
        );
        const textBuf = await fs.promises.readFile(mdPath);
        const text = textBuf.toString() || '';
        setMdContent(text);
      } catch (error) {
        message.error('文件可能已损坏，加载失败');
        console.log('Loading markdown error: ', error);
      }
    })();
  }, [state.openMdId]);

  const handleSave = async (text: string) => {
    if (!state.openMdId) return;
    try {
      const mdPath = path.join(
        __dirname,
        '..',
        'assets',
        'docs',
        'markdown',
        `${state.openMdId}.md`
      );
      await fs.promises.writeFile(mdPath, text);
      // 写入磁盘之后需要更新视图，否则在切换到空文件时会有不渲染的bug
      setMdContent(text);
    } catch (error) {
      message.error('文件可能已损坏，保存失败');
      console.log('Override markdown error: ', error);
    }
  };

  const renderEditor = () => {
    return (
      <Editor
        textValue={mdContent}
        handleSave={handleSave}
        handleChange={() => {}}
        maxHeight="80vh"
        withoutBorder
      />
    );
  };

  return (
    <MarkdownPanelWrapper>
      {state.openMdId ? renderEditor() : <Empty />}
    </MarkdownPanelWrapper>
  );
}
