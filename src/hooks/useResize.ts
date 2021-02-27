import { DependencyList, useEffect } from 'react';

const useResize = (resizeListener: () => void, depend: DependencyList) => {
  useEffect(() => {
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, depend);
};

export default useResize;
