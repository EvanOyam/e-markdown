import React, { useReducer } from 'react';
import styled from '@emotion/styled';
import MindmapMenu from '../../components/TreeMenu';
import MindmapPanel from './MindmapPanel';
import { MdContextProvider, mdReducer } from '../../context/markdownContext';

const MindmapWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

// todo refactor: 抽象 menu
export default function Markdown() {
  const [state, dispatch] = useReducer(mdReducer, { openMdId: '' });
  return (
    <MdContextProvider value={{ state, dispatch }}>
      <MindmapWrapper>
        <MindmapMenu />
        <MindmapPanel />
      </MindmapWrapper>
    </MdContextProvider>
  );
}
