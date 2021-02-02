import React from 'react';
import MarkdownMenu from '../components/markdown/MarkdownMenu';
import {
  MarkdownMenuWrapper,
  MarkdownPanel,
  MarkdownWrapper,
} from '../style/markdown.style';

export default function Markdown() {
  return (
    <MarkdownWrapper>
      <MarkdownMenuWrapper>
        <MarkdownMenu />
      </MarkdownMenuWrapper>
      <MarkdownPanel />
    </MarkdownWrapper>
  );
}
