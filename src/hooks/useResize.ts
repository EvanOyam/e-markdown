import { useEffect } from 'react';

const useResize = (resizeListener: () => void) => {
  useEffect(() => {
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);
};

export default useResize;
