import { useState, useEffect } from 'react';

export function useActiveNav(defaultId = 'dashboard') {
  const [activeId, setActiveId] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || defaultId;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveId(hash);
      } else {
        setActiveId(defaultId);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [defaultId]);

  const setNav = (id: string) => {
    window.location.hash = id;
    setActiveId(id);
  };

  return { activeId, setActiveId: setNav };
}
