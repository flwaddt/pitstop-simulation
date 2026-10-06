import { useCallback, useRef, useState } from 'react';
import { INITIAL_STATE, STATES, resolveState } from '../data/states.js';
import { playCue } from '../lib/audio.js';

/**
 * Owns the current state id. `act(action, fromId)` ignores stale events
 * (a timer or video end that fires after the viewer already moved on).
 */
export default function useSimulation() {
  const [stateId, setStateId] = useState(INITIAL_STATE);
  const [visit, setVisit] = useState(0); // bumps on every entry, even to the same state
  const currentRef = useRef(INITIAL_STATE);

  const enter = useCallback((target) => {
    const id = resolveState(target);
    if (!STATES[id]) {
      console.warn(`[PITSTOP] Unknown state "${id}"`);
      return;
    }
    currentRef.current = id;
    setStateId(id);
    setVisit((v) => v + 1);
    if (STATES[id].cue) playCue(STATES[id].cue);
  }, []);

  const act = useCallback(
    (action, fromId = currentRef.current) => {
      if (fromId !== currentRef.current) return;
      const cur = STATES[currentRef.current];
      let target = cur.actions?.[action];
      if (!target && (action === 'NEXT' || action === 'ENDED' || action === 'AUTO')) target = cur.next;
      if (!target) return;
      enter(target);
    },
    [enter],
  );

  const restart = useCallback(() => enter(INITIAL_STATE), [enter]);

  return { stateId, visit, state: STATES[stateId], act, restart };
}
