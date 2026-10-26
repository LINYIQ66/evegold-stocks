import React, { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { visionMedia } from '@/components/home/vision2027/visionMedia';
import useSceneVisibility from '@/components/home/vision2027/useSceneVisibility';
import useCinematicPlayback from '@/components/home/vision2027/useCinematicPlayback';

export default function VisionBackdrop({ copy }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [posterReady, setPosterReady] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const visibility = useSceneVisibility(containerRef);
  const playback = useCinematicPlayback({ videoRef, ...visibility, posterReady });
  return (
    <>
      <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-vision-night">
        <img src={visionMedia.poster} width={1440} height={810} fetchPriority="high" decoding="async" alt="" onLoad={() => setPosterReady(true)} onError={() => setPosterReady(true)} className="absolute inset-0 h-full w-full object-cover object-right" />
        <video ref={videoRef} src={playback.load ? visionMedia.video : undefined} poster={visionMedia.poster} preload="none" muted loop playsInline controls aria-label={copy.videoLabel} onPlay={playback.onPlay} onPause={playback.onPause} onLoadedData={() => setReady(true)} onError={() => setFailed(true)} className={`absolute inset-0 h-full w-full object-cover object-right transition-opacity duration-700 motion-reduce:transition-none ${ready && !failed ? 'opacity-80' : 'opacity-0'}`} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-vision-night via-vision-night/75 to-vision-night/20" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-vision-night via-transparent to-vision-night/20" />
      </div>
      {!failed && <button type="button" onClick={playback.toggle} aria-label={playback.playing ? copy.pause : copy.play} className="absolute right-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-desk-silver/25 bg-vision-night/70 px-3 py-2 text-xs text-desk-silver focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-glow md:right-10">{playback.playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}<span className="hidden sm:inline">{playback.playing ? copy.pause : copy.play}</span></button>}
    </>
  );
}