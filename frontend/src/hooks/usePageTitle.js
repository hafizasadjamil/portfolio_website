import { useEffect } from 'react';

const SITE = 'Muhammad Asad Jamil';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE} | AI Security Engineer`;
  }, [title]);
};

export default usePageTitle;
