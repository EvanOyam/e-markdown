import React from 'react';
import Editor from '../../components/Editor';
import MarkdownMenu from './MarkdownMenu';
import { MarkdownPanel, MarkdownWrapper } from './markdown.style';

// todo feat: 支持导入 md
// todo feat: 支持导出 md

export default function Markdown() {
  return (
    <MarkdownWrapper>
      <MarkdownMenu />
      <MarkdownPanel>
        <Editor
          textValue=""
          maxHeight="80vh"
          withoutBorder
          handleChange={() => {}}
        />
      </MarkdownPanel>
    </MarkdownWrapper>
  );
}
