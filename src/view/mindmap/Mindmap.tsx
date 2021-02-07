import React, { useEffect, useRef, useState } from 'react';
import { Transformer } from 'markmap-lib';
import * as markmap from 'markmap-view';
import * as fs from 'fs';
import * as path from 'path';
import { Spin } from 'antd';
import { CustomEventTarget, SvgSizeType } from '../../typings/mindmap';
import useResize from '../../hooks/useResize';

const { BrowserWindow } = require('electron').remote;

const markdownPath = path.join(__dirname, '..', 'assets', 'docs', 'mindmap.md');
const markdown = fs.readFileSync(markdownPath).toString();

// transform markdown and get assets
const transformer = new Transformer();
const { root } = transformer.transform(markdown);

let timer: any;

export default function Mindmap() {
  const [svgSize, setSvgSize] = useState({} as SvgSizeType);
  const [spinning, setSpinning] = useState(false);
  const mindmapRef = useRef<SVGSVGElement>(null);

  const { Markmap } = markmap;
  const initMindmap = (ele: SVGSVGElement | null, options: any) => {
    if (ele !== null) {
      if (ele.children.length !== 0) {
        ele.innerHTML = '';
      }
      Markmap.create(ele, options, root);
      setSpinning(false);
    }
  };

  const resizeListener = () => {
    const svgH = window.innerHeight - 50;
    const svgW = window.innerWidth - 400;
    const newSvgSize = { width: `${svgW}px`, height: `${svgH}px` };
    setSvgSize(newSvgSize);
    if (timer) {
      clearTimeout(timer);
    }
    setSpinning(true);
    timer = setTimeout(() => {
      initMindmap(mindmapRef.current, {});
    }, 1000);
  };

  useResize(resizeListener);

  useEffect(() => {
    const svgH = window.innerHeight - 50;
    const svgW = window.innerWidth - 400;
    const newSvgSize = { width: `${svgW}px`, height: `${svgH}px` };
    setSvgSize(newSvgSize);
    setTimeout(() => {
      initMindmap(mindmapRef.current, {});
    }, 0);
  }, []);

  const handleBeforeunload = (e: BeforeUnloadEvent) => {
    const ele = (e.target as CustomEventTarget).activeElement;
    if (ele?.nodeName === 'A') {
      e.returnValue = '';
      const { href } = ele;
      if (!href) return;
      const localScheme = href.startsWith('file://');
      if (!localScheme) {
        const win = new BrowserWindow({ width: 800, height: 600 });
        win.loadURL(href);
      }
    }
  };
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeunload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload);
    };
  }, []);
  return (
    <Spin spinning={spinning}>
      <svg
        ref={mindmapRef}
        style={{ ...svgSize, color: 'rgb(236, 236, 236)' }}
      />
    </Spin>
  );
}
