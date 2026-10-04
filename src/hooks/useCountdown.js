import { useEffect, useRef, useState } from 'react';

/**
 * Whole-second countdown from `total` to 0. Calls `onDone` once at zero
 * (after a short beat so the "0" is visible) and `onTick(n)` on each change.
 */
export default function useCountdown(total, onDone, onTick) {
  const [left, setLeft] = useState(total);
  const doneRef = useRef(onDone);
  const tickRef = useRef(onTick);
  doneRef.current = onDone;
  tickRef.current = onTick;

  useEffect(() => {
    const start = performance.now();
    let last = total;
    let doneTimer;
    const id = setInterval(() => {
      const rem = Math.max(0, total - Math.floor((performance.now() - start) / 1000));
      if (rem === last) return;
      last = rem;
      setLeft(rem);
      tickRef.current?.(rem);
      if (rem === 0) {
        clearInterval(id);
        doneTimer = setTimeout(() => doneRef.current?.(), 450);
      }
    }, 80);
    return () => {
      clearInterval(id);
      clearTimeout(doneTimer);
    };
  }, [total]);

  return left;
}
