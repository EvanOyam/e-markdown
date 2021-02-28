import React, { useEffect, useRef, useState, useContext } from 'react';
import { Transformer } from 'markmap-lib';
import * as markmap from 'markmap-view';
import * as fs from 'fs';
import * as path from 'path';
import { message, Spin } from 'antd';
import styled from '@emotion/styled';
import { CloseCircleOutlined } from '@ant-design/icons';
import { SvgSizeType } from '../../typings/mindmap';
import useResize from '../../hooks/useResize';
import useNewWindow from '../../hooks/useNewWindow';
import { MdContext } from '../../context/markdownContext';
import Editor from '../../components/Editor';
import Empty from '../../components/Empty';

const MindmapPanelWrapper = styled.div`
  flex: 1;
  background-color: #272b31;
  height: 100vh;
  padding: 16px;
`;

const MindmapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: flex;
  position: relative;
`;

const CloseWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 38px;
  color: rgb(204, 204, 204);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  &:hover {
    cursor: pointer;
    transition: all 0.3s;
    transform: scale(1.1);
    color: rgb(236, 236, 236);
  }
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
  const [mdContent, setMdContent] = useState('');
  const [showMindmap, setShowMindmap] = useState(false);

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

  // 保存
  const handleSave = async (text: string) => {
    if (!state.openMdId) return;
    try {
      const mdPath = path.join(
        __dirname,
        '..',
        'assets',
        'docs',
        'markdown',
        `${state.openMdId}.md`
      );
      await fs.promises.writeFile(mdPath, text);
      // 写入磁盘之后需要更新视图，否则在切换到空文件时会有不渲染的bug
      setMdContent(text);
    } catch (error) {
      message.error('文件可能已损坏，保存失败');
      console.log('Override markdown error: ', error);
    }
  };

  // 文档变更时绘制 mindmap
  useEffect(() => {
    if (!state.openMdId) return;
    (async () => {
      try {
        const mdPath = path.join(
          __dirname,
          '..',
          'assets',
          'docs',
          'markdown',
          `${state.openMdId}.md`
        );
        const textBuf = await fs.promises.readFile(mdPath);
        const text = textBuf.toString() || '';
        setMdContent(text);
      } catch (error) {
        message.error('文件可能已损坏，加载失败');
        console.log('Loading markdown error: ', error);
      }
    })();
    setSvg();
    setTimeout(() => {
      setMindmap();
    }, 0);
  }, [state.openMdId, showMindmap]);

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
  const renderMindmap = () => {
    return (
      <MindmapWrapper>
        <CloseWrapper>
          <CloseCircleOutlined onClick={() => setShowMindmap(false)} />
        </CloseWrapper>
        <Spin spinning={spinning}>
          <svg
            ref={mindmapRef}
            style={{ ...svgSize, color: 'rgb(236, 236, 236)' }}
          />
        </Spin>
      </MindmapWrapper>
    );
  };

  // 渲染编辑器
  const renderEditor = () => {
    const showMap = () => {
      setShowMindmap(true);
    };
    return (
      <Editor
        textValue={mdContent}
        handleSave={handleSave}
        handleChange={() => {}}
        handleMap={showMap}
        maxHeight="80vh"
        withoutBorder
        mindmap
      />
    );
  };

  // 渲染内容
  const renderContent = () => {
    return showMindmap ? renderMindmap() : renderEditor();
  };

  return (
    <MindmapPanelWrapper>
      {state.openMdId ? renderContent() : <Empty />}
    </MindmapPanelWrapper>
  );
}
