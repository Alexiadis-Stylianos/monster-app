import { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import styles from "./Styles.module.css";
import scream from './assets/sounds/scream.wav';
import exorcism from './assets/sounds/exorcism.wav';
import { useSound } from "./SoundContext";
import CalculatePrice from "./CalculatePrice";
import { pluralizeMonster } from "./monsterPlurals";
import monsterData from "./monsterData";
import MonsterCard from "./MonsterCard";

function MonsterForm({ setHorde, purchased, setPurchased }) {
    const [selectedMonster, setSelectedMonster] = useState("ghost");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [holyEffect, setHolyEffect] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isFading, setIsFading] = useState(false);

    //Exorcism
    const handleExorcism = () => {
        play(exorcismAudio.current);

        setHolyEffect(true);

        //Clear everyting and holy lights
        setTimeout(() => {
            setHorde([]);
            setPurchased(false);
            setInputs({});
            setHolyEffect(false);
        }, 2000); // effect duration

        setConfirmOpen(false);
    };

    const { register, play } = useSound();

    const screamAudio = useRef(new Audio(scream));

    const exorcismAudio = useRef(new Audio(exorcism));

    useEffect(() => {
        register(screamAudio.current);
        register(exorcismAudio.current);
    }, [register]);

    //formatting
    const formatList = (arr) => {
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return arr.join(" and ");
        return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
    };

    // ADD TO HORDE
    const handleAddToHorde = (monster, quantity, colors) => {
        const price = CalculatePrice(monster.id, colors);

        play(screamAudio.current);

        setHorde(prev => {
            const existingIndex = prev.findIndex(
                m =>
                    m.monster === monster.id &&
                    JSON.stringify(m.colors.sort()) === JSON.stringify(colors.sort())
            );

            if (existingIndex !== -1) {
                // Increase quantity if already exists
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }

            // Otherwise add new entry
            return [
                ...prev,
                {
                    monster: monster.id,
                    colors,
                    price,
                    quantity
                }
            ];
        });

        setModalMessage(
            `${quantity} x ${formatList(colors)} ${pluralizeMonster(monster.name, quantity)} added (${price * quantity}€)`
        );

        setModalOpen(true);
    };

    //Category filter
    const categories = ["All", ...new Set(monsterData.map(m => m.category))];
    const filteredMonsters = monsterData.filter(monster =>
        selectedCategory === "All" || monster.category === selectedCategory
    );
    useEffect(() => {
        const exists = filteredMonsters.find(m => m.id === selectedMonster);

        if (!exists && filteredMonsters.length > 0) {
            setSelectedMonster(filteredMonsters[0].id);
        }
    }, [selectedCategory]);

    return (
        <div className={styles.shopContainer}>
            <h1>Monster Shop</h1>

            {/* CATEGORY FILTER */}
            <div style={{ marginBottom: "15px" }}>
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => {
                            if (selectedCategory === category) return;

                            setIsFading(true);

                            setTimeout(() => {
                                setSelectedCategory(category);
                                setIsFading(false);
                            }, 120); // small delay for fade-out
                        }}
                        className={`${styles.categoryButton} ${selectedCategory === category ? styles.categoryActive : ""
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* MONSTER GRID */}
            <div
                // className={styles.monsterGrid}
                // style={{
                //     opacity: isFading ? 0 : 1,
                //     transition: "opacity 0.15s ease"
                // }}
                className={`${styles.monsterGrid} ${isFading ? styles.fadeOut : styles.fadeIn
                    }`}
            >
                {filteredMonsters.map(monster => {
                    return (
                        <MonsterCard
                            key={monster.id}
                            monster={monster}
                            onAdd={handleAddToHorde}
                        />
                    );
                })}
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
                            style={{ backgroundColor: "#777" }}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </Modal>

            {/* HOLY EFFECT */}
            {holyEffect && (
                <div className={styles.holyContainer}>
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