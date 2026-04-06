import { useState } from 'react';

export function useToggle(initial = true) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn(v => !v);
  return { on, toggle };
}
