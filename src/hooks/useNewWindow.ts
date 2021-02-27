import { useEffect } from 'react';
import { CustomEventTarget } from '../typings/mindmap';

const { BrowserWindow } = require('electron').remote;

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

const useNewWindow = () => {
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeunload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload);
    };
  }, []);
};

export default useNewWindow;
