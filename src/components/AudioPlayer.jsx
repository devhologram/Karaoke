import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const AudioPlayer = forwardRef(({ src, onTimeUpdate, onEnded, onError }, ref) => {
  const audioRef = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => audioRef.current?.play(),
    pause: () => audioRef.current?.pause(),
    get currentTime() {
      return audioRef.current?.currentTime || 0;
    }
  }));

  const handleTimeUpdate = () => {
    if (audioRef.current && onTimeUpdate) {
      onTimeUpdate(audioRef.current.currentTime);
    }
  };

  return (
    <audio
      ref={audioRef}
      src={src}
      onTimeUpdate={handleTimeUpdate}
      onEnded={onEnded}
      onError={onError}
      controls={false}
    />
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
