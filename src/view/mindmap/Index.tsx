import React from 'react';
import styled from '@emotion/styled';
import MindmapMenu from './MindmapMenu';
import MindmapPanel from './MindmapPanel';

const MindmapWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

// todo refactor: 抽象 menu
export default function Markdown() {
  return (
    <MindmapWrapper>
      <MindmapMenu />
      <MindmapPanel />
    </MindmapWrapper>
  );
}
