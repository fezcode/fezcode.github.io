import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | Fezcodex`;
  }, [title]);
};

export default usePageTitle;
