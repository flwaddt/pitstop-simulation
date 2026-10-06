import { useCallback, useEffect, useState } from 'react';
import CinematicPlayer from './components/CinematicPlayer.jsx';
import Hud from './components/Hud.jsx';
import AssetPlaceholder from './components/AssetPlaceholder.jsx';
import { SCREENS } from './screens/index.js';
import { upcomingVideo } from './data/states.js';
import useSimulation from './hooks/useSimulation.js';
import { AutoCtx } from './lib/autoCtx.js';
import { isMuted, onMuteChange, playCue, setMusic, setMuted, unlockAudio } from './lib/audio.js';

export default function App() {
  const { stateId, visit, state, act, restart } = useSimulation();
  const [muted, setMutedState] = useState(isMuted());
  const [missing, setMissing] = useState(null);
  const [isFs, setIsFs] = useState(false);

  useEffect(() => onMuteChange(setMutedState), []);
  useEffect(() => {
    const h = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  // Timed screens advance on their own.
  useEffect(() => {
    if (state.type !== 'ui' || !state.auto) return;
    const t = setTimeout(() => act('AUTO', stateId), state.auto * 1000);
    return () => clearTimeout(t);
  }, [visit, stateId, state, act]);

  // Optional music only under UI screens (never under the videos).
  useEffect(() => {
    setMusic(state.type === 'ui' && stateId !== 'UI_1');
  }, [state.type, stateId]);

  const screenAct = useCallback(
    (action) => {
      unlockAudio();
      if (action !== 'OK' && action !== 'NO_RESPONSE') playCue('click');
      act(action, stateId);
    },
    [act, stateId],
  );

  const onEnded = useCallback((id) => act('ENDED', id), [act]);
  const onMissing = useCallback((id, src) => setMissing({ id, src }), []);
  const skip = useCallback(() => act('NEXT', stateId), [act, stateId]);
  const canSkip = state.type === 'video' || Boolean(state.auto);

  // SPACE moves the experience on. Screens with keys:'self' (RIDE, UI 3)
  // handle their own keys.
  const advance = useCallback(() => {
    unlockAudio();
    if (state.primary) screenAct(state.primary);
    else if (canSkip) skip();
  }, [state, canSkip, skip, screenAct]);
  const spaceHint = state.keys === 'self' ? null : state.primary ? state.hint || state.primary : canSkip ? (state.type === 'video' ? 'SKIP' : 'NEXT') : null;

  useEffect(() => {
    const h = (e) => {
      if (e.code !== 'Space' && e.key !== ' ') return;
      e.preventDefault();
      if (e.repeat) return;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      if (state.keys === 'self') return;
      advance();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [state, advance]);

  const toggleFs = useCallback(() => {
    try {
      if (document.fullscreenElement) document.exitFullscreen?.();
      else document.documentElement.requestFullscreen?.()?.catch?.(() => {});
    } catch {}
  }, []);

  const mode = state.type === 'video' ? 'play' : state.backdrop === 'freeze' ? 'freeze' : 'hidden';
  const Screen = state.type === 'ui' ? SCREENS[state.screen] : null;

  return (
    <main className={`app mode-${mode}`} data-state={stateId}>
      <CinematicPlayer
        stateId={stateId}
        state={state}
        mode={mode}
        preloadSrc={upcomingVideo(stateId)}
        muted={muted}
        onEnded={onEnded}
        onMissing={onMissing}
      />

      {Screen && (
        <AutoCtx.Provider value={state.auto || 0}>
          <div className={`stage ${state.bare ? 'stage-bare' : ''}`} key={visit}>
            {state.bare ? (
              <Screen act={screenAct} state={state} />
            ) : (
              <div className="win-wrap">
                <Screen act={screenAct} state={state} />
              </div>
            )}
          </div>
        </AutoCtx.Provider>
      )}

      {missing && missing.id === stateId && <AssetPlaceholder stateId={stateId} src={missing.src} onContinue={skip} />}

      <Hud
        state={state}
        stateId={stateId}
        muted={muted}
        spaceHint={spaceHint}
        onToggleMute={() => {
          unlockAudio();
          setMuted(!muted);
        }}
        onRestart={restart}
        onSpace={advance}
        onFullscreen={toggleFs}
        isFullscreen={isFs}
      />
    </main>
  );
}
