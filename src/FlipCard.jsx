import { useState, useRef, useEffect } from "react";
import styles from "./Styles.module.css";
import flip from './assets/sounds/page_flip.wav';
import { useSound } from "./context/SoundContext";
import { useAudio } from "./hooks/useAudio";

function FlipCard({ image, lore }) {
  const [flipped, setFlipped] = useState(false);
  const { register, play } = useSound();

  //page turn sound
  const flipAudio = useAudio(flip);

  const handleFlip = () => {
    play(flipAudio.current);
    setTimeout(() => {
      setFlipped(prev => !prev);
    }, 50);
  };

  return (
    <div className={styles.card} onClick={handleFlip}>
      <div
        className={styles.cardInner}
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div className={`${styles.cardFace} ${styles.cardFront}`}>
          <img src={image} alt="monster" />
          {!flipped && (
            <div className={styles.hint}>
              Click to reveal lore
            </div>
          )}
        </div>

        <div
          className={`${styles.cardFace} ${styles.cardBack}`}
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className={styles.overlay}>
            <p>{lore}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlipCard;

