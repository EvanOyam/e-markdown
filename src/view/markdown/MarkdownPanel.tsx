import styled from '@emotion/styled';
import React, { useContext, useEffect, useState } from 'react';
import { FolderOpenOutlined } from '@ant-design/icons';
import * as path from 'path';
import * as fs from 'fs';
import { message } from 'antd';
import Editor from '../../components/Editor';
import { MdContext } from '../../context/markdownContext';

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

const EmptyWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  h2 {
    color: rgb(184, 184, 184, 0.5);
    margin-top: 12px;
  }
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
        const text = (await fs.promises.readFile(mdPath)).toString() || '';
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

  const renderEmpty = () => {
    return (
      <EmptyWrapper>
        <FolderOpenOutlined
          style={{ fontSize: '64px', color: 'rgb(184, 184, 184,0.5)' }}
        />
        <h2>请选择文档</h2>
      </EmptyWrapper>
    );
  };

  return (
    <MarkdownPanelWrapper>
      {state.openMdId ? renderEditor() : renderEmpty()}
    </MarkdownPanelWrapper>
  );
}
