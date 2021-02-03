import React from 'react';
import Editor from '../../components/Editor';
import MarkdownMenu from './MarkdownMenu';
import { MarkdownPanel, MarkdownWrapper } from './markdown.style';

// todo 支持导入 md
// todo 支持导出 md

export default function Markdown() {
  return (
    <MarkdownWrapper>
      <MarkdownMenu />
      <MarkdownPanel>
        <Editor initValue="" maxHeight="80vh" withoutBorder />
      </MarkdownPanel>
    </MarkdownWrapper>
  );
}
