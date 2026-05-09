import { useState, useRef, useEffect, useMemo } from "react";
import Modal from "./Modal";
import styles from "./Styles.module.css";
import scream from './assets/sounds/scream.wav';
import exorcism from './assets/sounds/exorcism.wav';
import { useSound } from "./context/SoundContext";
import CalculatePrice from "./CalculatePrice";
import { pluralizeMonster } from "./utils/monsterPlurals";
import monsterData from "./data/monsterData";
import MonsterCard from "./MonsterCard";
import { formatList } from "./utils/formatList";
import { useAudio } from "./hooks/useAudio";
import { MAX_QUANTITY } from "./utils/constants";
import { useToast } from "./hooks/useToast";

function MonsterForm({ setHorde, horde, purchased, setPurchased }) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [holyEffectKey, setHolyEffectKey] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isFading, setIsFading] = useState(false);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    //Exorcism
    const handleExorcism = () => {
        play(exorcismAudio.current);

        setHolyEffectKey(prev => prev + 1);

        //Clear everyting and holy lights
        setTimeout(() => {
            setHorde([]);
            setPurchased(false);
            setHolyEffectKey(0);
        }, 2000); // effect duration

        setConfirmOpen(false);
    };

    const { register, play } = useSound();

    const screamAudio = useAudio(scream);
    const exorcismAudio = useAudio(exorcism);

    // ADD TO HORDE
    const handleAddToHorde = (monster, quantity, colors) => {
        const price = CalculatePrice(monster.id, colors);

        play(screamAudio.current);

        let toastMessage = "";

        setHorde(prev => {
            const existingIndex = prev.findIndex(m => {
                const sameMonster = m.monster === monster.id;

                const sortedA = [...m.colors].sort();
                const sortedB = [...colors].sort();

                const sameColors =
                    JSON.stringify(sortedA) === JSON.stringify(sortedB);

                return sameMonster && sameColors;
            });

            // MONSTER ALREADY EXISTS
            if (existingIndex !== -1) {
                const updated = [...prev];

                const currentQty = updated[existingIndex].quantity;

                const newQty = Math.min(
                    currentQty + quantity,
                    MAX_QUANTITY
                );

                updated[existingIndex].quantity = newQty;

                const addedAmount = newQty - currentQty;

                toastMessage =
                    addedAmount > 0
                        ? `${addedAmount} x ${formatList(colors)} ${pluralizeMonster(
                            monster.name,
                            addedAmount
                        )} added (${MAX_QUANTITY - newQty} slots left)`
                        : `Maximum (${MAX_QUANTITY}) reached for ${formatList(
                            colors
                        )} ${pluralizeMonster(
                            monster.name,
                            MAX_QUANTITY
                        )}`;

                return updated;
            }

            // NEW MONSTER ENTRY
            const safeQuantity = Math.min(quantity, MAX_QUANTITY);

            toastMessage = `${safeQuantity} x ${formatList(
                colors
            )} ${pluralizeMonster(
                monster.name,
                safeQuantity
            )} added (${price * safeQuantity}€)`;

            return [
                ...prev,
                {
                    monster: monster.id,
                    colors,
                    price,
                    quantity: safeQuantity
                }
            ];
        });

        setTimeout(() => {
            addToast(toastMessage);
        }, 0);
    };

    //Category filter
    const categories = useMemo(() =>
        ["All", ...new Set(monsterData.map(m => m.category))],
        []);
    const filteredMonsters = monsterData.filter(monster =>
        selectedCategory === "All" || monster.category === selectedCategory
    );

    const handleCategoryChange = (category) => {
        if (selectedCategory === category) return;

        setIsFading(true);

        setTimeout(() => {
            setLoading(true);
            setSelectedCategory(category);
            setIsFading(false);

            setTimeout(() => {
                setLoading(false);
            }, 350); // skeleton duration
        }, 200); // fade out duration
    };

    return (
        <div className={styles.shopContainer}>
            <h1>Monster Shop</h1>

            {/* CATEGORY FILTER */}
            <div style={{ marginBottom: "15px" }}>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`${styles.categoryButton} ${selectedCategory === category ? styles.categoryActive : ""
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* MONSTER GRID */}
            <div
                className={`${styles.monsterGrid} ${isFading ? styles.fadeOut : styles.fadeIn
                    }`}
            >
                {loading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={styles.skeletonCard}>
                            <div className={styles.skeletonImage}></div>
                            <div className={styles.skeletonLine}></div>
                            <div className={styles.skeletonLine}></div>
                            <div className={styles.skeletonLineSmall}></div>
                        </div>
                    ))
                    : filteredMonsters.map(monster => (
                        <MonsterCard
                            key={monster.id}
                            monster={monster}
                            horde={horde}
                            onAdd={handleAddToHorde}
                        />
                    ))}
            </div>

            {/* MODALS */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <h2>Added to Horde</h2>
                <p>{modalMessage}</p>
            </Modal>

            <button
                className={styles.exorcismbutton}
                disabled={!purchased}
                onClick={() => setConfirmOpen(true)}
            >
                Exorcism (Free)
            </button>

            <Modal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleExorcism}
            >
                {({ selected, onConfirm, onClose }) => (
                    <>
                        <h2>Exorcism Ritual</h2>
                        <p>This will banish all monsters.</p>

                        <button
                            data-action="confirm"
                            onClick={onConfirm}
                            className={`${styles.mybutton} ${selected === "confirm" ? styles.modalSelected : ""
                                }`}
                            style={{ backgroundColor: "crimson" }}
                        >
                            Yes, Exorcise
                        </button>

                        <button
                            data-action="cancel"
                            onClick={onClose}
                            className={`${styles.mybutton} ${selected === "cancel" ? styles.modalSelected : ""
                                }`}
                            style={{ backgroundColor: "#777", marginLeft: "10px" }}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </Modal>

            {/* HOLY EFFECT */}
            {holyEffectKey > 0 && (
                <div
                    key={holyEffectKey}
                    className={styles.holyContainer}>
                    {Array.from({ length: 75 }).map((_, i) => (
                        <span
                            key={i}
                            className={styles.holyParticle}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${60 + Math.random() * 30}%`
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
export default MonsterForm;