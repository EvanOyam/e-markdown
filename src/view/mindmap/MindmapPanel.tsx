import React, { useEffect, useRef, useState, useContext } from 'react';
import { Transformer } from 'markmap-lib';
import * as markmap from 'markmap-view';
import * as fs from 'fs';
import * as path from 'path';
import { Spin } from 'antd';
import styled from '@emotion/styled';
import { SvgSizeType } from '../../typings/mindmap';
import useResize from '../../hooks/useResize';
import useNewWindow from '../../hooks/useNewWindow';
import { MdContext } from '../../context/markdownContext';

const MindmapPanelWrapper = styled.div`
  flex: 1;
  background-color: #272b31;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: scroll;
  height: 100vh;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// md base路径
const mdBasePath = path.join(__dirname, '..', 'assets', 'docs', 'markdown');

// mindmap 转换器
const transformer = new Transformer();
const { Markmap } = markmap;

// 重新渲染延时器
let timer: any;

export default function MindmapPanel() {
  const [svgSize, setSvgSize] = useState({} as SvgSizeType); // mindmap svg 尺寸
  const [spinning, setSpinning] = useState(false); // loading
  const mindmapRef = useRef<SVGSVGElement>(null);
  const { state } = useContext(MdContext);

  // 设置 svg 尺寸
  const setSvg = () => {
    const svgH = window.innerHeight - 50;
    const svgW = window.innerWidth - 400;
    const newSvgSize = { width: `${svgW}px`, height: `${svgH}px` };
    setSvgSize(newSvgSize);
  };

  // 绘制 mindmap
  const setMindmap = () => {
    if (!state.openMdId) return;
    const ele = mindmapRef.current;
    if (ele !== null) {
      if (ele.children.length !== 0) {
        ele.innerHTML = '';
      }
      const mdPath = path.join(mdBasePath, `${state.openMdId}.md`);
      const md = fs.readFileSync(mdPath).toString();
      const { root } = transformer.transform(md);
      Markmap.create(ele, {}, root);
      setSpinning(false);
    }
  };

  // 文档变更时绘制 mindmap
  useEffect(() => {
    setSvg();
    setTimeout(() => {
      setMindmap();
    }, 0);
  }, [state.openMdId]);

  // 窗口缩放重新渲染 mindmap
  const resizeListener = () => {
    if (timer) clearTimeout(timer);
    setSpinning(true);
    setSvg();
    timer = setTimeout(() => {
      setMindmap();
    }, 1000);
  };
  useResize(resizeListener, [state.openMdId]);

  // 新窗口打开链接
  useNewWindow();

  // 渲染 mindmap
  const renderMindmap = () => (
    <Spin spinning={spinning}>
      <svg
        ref={mindmapRef}
        style={{ ...svgSize, color: 'rgb(236, 236, 236)' }}
      />
    </Spin>
  );

  // 渲染空数据
  const renderEmpty = () => 'Empty';

  return (
    <MindmapPanelWrapper>
      {state.openMdId ? renderMindmap() : renderEmpty()}
    </MindmapPanelWrapper>
  );
}
