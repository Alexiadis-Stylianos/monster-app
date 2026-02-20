import { createContext, useContext, useRef } from "react";

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const soundsRef = useRef([]);

  const fadeOut = (audio, duration = 300) => {
    const stepTime = 40;
    const steps = duration / stepTime;
    const volumeStep = audio.volume / steps;

    const fadeInterval = setInterval(() => {
      if (audio.volume > volumeStep) {
        audio.volume -= volumeStep;
      } else {
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
        clearInterval(fadeInterval);
      }
    }, stepTime);
  };

  const stopAll = () => {
    soundsRef.current.forEach(audio => {
      if (!audio.paused) fadeOut(audio);
    });
  };

  const register = (audio) => {
    if (!soundsRef.current.includes(audio)) {
      soundsRef.current.push(audio);
    }
  };

  const play = (audio) => {
    stopAll();
    audio.volume = 1;
    audio.currentTime = 0;
    audio.play();
  };

  const stop = (audio) => {
    if (!audio.paused) fadeOut(audio);
  };

  return (
    <SoundContext.Provider value={{ register, play, stop }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
