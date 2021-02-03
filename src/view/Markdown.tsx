import React from 'react';
import Editor from '../components/Editor';
import MarkdownMenu from '../components/markdown/MarkdownMenu';
import { MarkdownPanel, MarkdownWrapper } from '../style/markdown.style';

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
