import { useState } from 'react';

export function useActiveNav(defaultId = 'dashboard') {
  const [activeId, setActiveId] = useState(defaultId);
  return { activeId, setActiveId };
}
