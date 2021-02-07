import React from 'react';
import MindmapMenu from './MindmapMenu';
import { MindmapPanel, MindmapWrapper } from './mindmap.style';
import Mindmap from './Mindmap';

// todo refactor: 抽象 menu
export default function Markdown() {
  return (
    <MindmapWrapper>
      <MindmapMenu />
      <MindmapPanel>
        <Mindmap />
      </MindmapPanel>
    </MindmapWrapper>
  );
}
