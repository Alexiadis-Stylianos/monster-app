import { useState, useRef, useEffect } from "react";
import styles from "./Styles.module.css";
import growl from './assets/sounds/growl.wav';
import { useSound } from "./SoundContext";

function MonsterCard({ monster, onAdd }) {
    const [quantity, setQuantity] = useState(1);
    const growlAudio = useRef(new Audio(growl));
    const { register, play, stop } = useSound();

    //Hover features
    const handleHoverEnter = () => {
        if (!growlAudio.current || !growlAudio.current.paused) return;
        play(growlAudio.current);
    };

    const handleHoverLeave = () => {
        stop(growlAudio.current);
    }

    useEffect(() => {
        register(growlAudio.current);
    }, [register]);

    return (
        <div key={monster.id} className={styles.monsterCard}>
            <img
                src={monster.image}
                alt={monster.name}
                className={styles.monsterImage}
            />
            <h3>{monster.name}</h3>
            <p>{monster.category}</p>
            <p>{monster.price}€</p>

            {/* QUANTITY */}
            <div>
                <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className={styles.quantityButton}
                >
                    -
                </button>

                <span style={{ margin: "0 10px" }}>{quantity}</span>

                <button
                    onClick={() => setQuantity(q => q + 1)}
                    className={styles.quantityButton}
                >
                    +
                </button>
            </div>
            <button
                className={styles.mybutton}
                onMouseEnter={handleHoverEnter}
                onMouseLeave={handleHoverLeave}
                onClick={() => onAdd(monster, quantity)}
            >
                Add to Horde
            </button>
        </div>
    );
}

export default MonsterCard;