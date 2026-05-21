import { useContext } from "react";
import SoundContext from "../context/SoundContext";

export function useSound() {
    return useContext(SoundContext);
}