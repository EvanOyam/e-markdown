import React from 'react';
import {
  ChartPanelWrapper,
  ChartTitle,
  ChartOuterWrapper,
} from './dashboard.style';
import TodoChart from './TodoChart';
import MarkdownChart from './MarkdownChart';
import MindmapChart from './MindmapChart';

// todo refactor: 抽象代码
export default function ChartPanel() {
  return (
    <ChartPanelWrapper>
      <ChartOuterWrapper>
        <ChartTitle>任务趋势</ChartTitle>
        <TodoChart />
      </ChartOuterWrapper>
      <ChartOuterWrapper>
        <ChartTitle>笔记趋势</ChartTitle>
        <MarkdownChart />
      </ChartOuterWrapper>
      <ChartOuterWrapper>
        <ChartTitle>脑图趋势</ChartTitle>
        <MindmapChart />
      </ChartOuterWrapper>
    </ChartPanelWrapper>
  );
}
