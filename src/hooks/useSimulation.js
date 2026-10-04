import { useCallback, useRef, useState } from 'react';
import { INITIAL_STATE, STATES, resolveState } from '../data/states.js';
import { playCue } from '../lib/audio.js';

/**
 * Owns the current state id and exposes `act(action, fromId)`.
 *
 * `fromId` guards against stale events: a countdown that fires after the
 * viewer already clicked, or a video `ended` event from a scene that was
 * skipped, is ignored because it no longer matches the current state.
 */
export default function useSimulation() {
  const [stateId, setStateId] = useState(INITIAL_STATE);
  const currentRef = useRef(INITIAL_STATE);

  const enter = useCallback((target) => {
    const { id, passed } = resolveState(target);
    passed.forEach((p) => STATES[p]?.cue && playCue(STATES[p].cue));
    if (!STATES[id]) {
      console.warn(`[PITSTOP] Unknown state "${id}"`);
      return;
    }
    currentRef.current = id;
    setStateId(id);
    if (STATES[id].cue) playCue(STATES[id].cue);
  }, []);

  const act = useCallback(
    (action, fromId = currentRef.current) => {
      if (fromId !== currentRef.current) return;
      const cur = STATES[currentRef.current];
      let target = cur.actions?.[action];
      if (!target && (action === 'NEXT' || action === 'ENDED')) target = cur.next;
      if (!target) {
        console.warn(`[PITSTOP] "${action}" is not available in ${currentRef.current}`);
        return;
      }
      enter(target);
    },
    [enter],
  );

  const restart = useCallback(() => enter(INITIAL_STATE), [enter]);

  return { stateId, state: STATES[stateId], act, restart };
}
