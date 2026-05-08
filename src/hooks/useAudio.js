import { useRef, useEffect } from "react";
import { useSound } from "../context/SoundContext";

export function useAudio(src) {
    const { register } = useSound();
    const audioRef = useRef(new Audio(src));

    useEffect(() => {
        register(audioRef.current);
    }, [register]);

    return audioRef;
}