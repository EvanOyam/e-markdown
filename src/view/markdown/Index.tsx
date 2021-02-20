import React, { useReducer } from 'react';
import styled from '@emotion/styled';
import MarkdownMenu from '../../components/TreeMenu';
import MarkdownPanel from './MarkdownPanel';
import { MdContextProvider, mdReducer } from '../../context/markdownContext';

const MarkdownWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

// todo feat: 支持导入 md
// todo feat: 支持导出 md

export default function Markdown() {
  const [state, dispatch] = useReducer(mdReducer, { openMdId: '' });
  return (
    <MdContextProvider value={{ state, dispatch }}>
      <MarkdownWrapper>
        <MarkdownMenu />
        <MarkdownPanel />
      </MarkdownWrapper>
    </MdContextProvider>
  );
}
