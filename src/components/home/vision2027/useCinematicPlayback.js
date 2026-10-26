import { useEffect, useRef, useState } from 'react';

export default function useCinematicPlayback({ videoRef, visible, automatic, posterReady }) {
  const [load, setLoad] = useState(false);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const [playing, setPlaying] = useState(false);
  const automaticPause = useRef(true);
  useEffect(() => {
    if (load || !visible || !posterReady || paused || (!automatic && !manual)) return;
    const start = () => setLoad(true);
    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 700);
    return () => window.clearTimeout(id);
  }, [load, visible, posterReady, paused, automatic, manual]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => {
      if (load && visible && !document.hidden && !paused && (automatic || manual)) {
        automaticPause.current = false;
        video.play().catch(() => setPlaying(false));
      } else { automaticPause.current = true; video.pause(); }
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, [videoRef, load, visible, paused, automatic, manual]);
  useEffect(() => {
    const video = videoRef.current;
    return () => { automaticPause.current = true; video?.pause(); };
  }, [videoRef]);
  const toggle = () => {
    if (playing) setPaused(true);
    else { setManual(true); setPaused(false); setLoad(true); }
  };
  return {
    load, playing, toggle,
    onPlay: () => { setPlaying(true); setPaused(false); },
    onPause: () => { setPlaying(false); if (!automaticPause.current) setPaused(true); }
  };
}