import { useCallback, useEffect, useState } from 'react';
import CinematicPlayer from './components/CinematicPlayer.jsx';
import PhoneUI from './components/PhoneUI.jsx';
import Hud from './components/Hud.jsx';
import Transition from './components/Transition.jsx';
import AssetPlaceholder from './components/AssetPlaceholder.jsx';
import { SCREENS } from './screens/index.js';
import { upcomingVideo } from './data/states.js';
import useSimulation from './hooks/useSimulation.js';
import { isMuted, onMuteChange, setMuted, unlockAudio } from './lib/audio.js';

export default function App() {
  const { stateId, state, act, restart } = useSimulation();
  const [muted, setMutedState] = useState(isMuted());
  const [missing, setMissing] = useState(null);
  const [isFs, setIsFs] = useState(false);

  useEffect(() => onMuteChange(setMutedState), []);
  useEffect(() => {
    const h = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  // Screens call act(action); bind it to the state they belong to so stale
  // timers or late clicks can't fire into a later state.
  const screenAct = useCallback(
    (action) => {
      if (action === 'START') unlockAudio();
      act(action, stateId);
    },
    [act, stateId],
  );

  const onEnded = useCallback((id) => act('ENDED', id), [act]);
  const onMissing = useCallback((id, src) => setMissing({ id, src }), []);
  const skip = useCallback(() => act('NEXT', stateId), [act, stateId]);

  // → or N skips a cinematic scene.
  useEffect(() => {
    if (state.type !== 'video') return;
    const h = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'n') skip();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [state.type, skip]);

  const toggleFs = useCallback(() => {
    try {
      if (document.fullscreenElement) document.exitFullscreen?.();
      else document.documentElement.requestFullscreen?.()?.catch?.(() => {});
    } catch {}
  }, []);

  const mode = stateId === 'START' ? 'hidden' : state.type === 'video' ? 'play' : 'backdrop';
  const Screen = state.type === 'ui' ? SCREENS[state.screen] : null;

  return (
    <main className={`app tone-${state.tone || 'neutral'} mode-${mode}`} data-state={stateId}>
      <CinematicPlayer
        stateId={stateId}
        state={state}
        mode={mode}
        preloadSrc={upcomingVideo(stateId)}
        muted={muted}
        onEnded={onEnded}
        onMissing={onMissing}
      />
      <div className="scrim" aria-hidden="true" />

      {Screen && state.phone && (
        <div className="stage">
          <PhoneUI tone={state.tone}>
            <Transition id={stateId}>
              <Screen act={screenAct} state={state} stateId={stateId} />
            </Transition>
          </PhoneUI>
        </div>
      )}

      {Screen && !state.phone && (
        <Transition id={stateId} className="stage-full">
          <Screen act={screenAct} state={state} stateId={stateId} />
        </Transition>
      )}

      {missing && missing.id === stateId && (
        <AssetPlaceholder stateId={stateId} src={missing.src} onContinue={skip} />
      )}

      {stateId !== 'START' && (
        <Hud
          state={state}
          stateId={stateId}
          muted={muted}
          onToggleMute={() => {
            unlockAudio();
            setMuted(!muted);
          }}
          onRestart={restart}
          onSkip={skip}
          onFullscreen={toggleFs}
          isFullscreen={isFs}
        />
      )}
    </main>
  );
}
