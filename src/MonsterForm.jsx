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
    const [inputs, setInputs] = useState({});
    const [selectedMonster, setSelectedMonster] = useState("ghost");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [holyEffect, setHolyEffect] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

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

    const { register, play} = useSound();

    const screamAudio = useRef(new Audio(scream));

    const exorcismAudio = useRef(new Audio(exorcism));

    useEffect(() => {
        register(screamAudio.current);
        register(exorcismAudio.current);
    }, [register]);


    /* --- form handlers --- */
    const handleChange = (e) => {
        const { name, type, checked } = e.target;
        setInputs(prev => ({ ...prev, [name]: type === "checkbox" ? checked : false }));
    };

    const getSelectedColors = () => {
        const colors = [];
        if (inputs.red) colors.push("red");
        if (inputs.green) colors.push("green");
        if (inputs.blue) colors.push("blue");
        return colors.length ? colors : ["normal"];
    };

    //formatting
    const formatList = (arr) => {
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return arr.join(" and ");
        return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
    };

    // ADD TO HORDE
    const handleAddToHorde = (monster, quantity) => {
        const colors = getSelectedColors();
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
                        onClick={() => setSelectedCategory(category)}
                        className={`${styles.categoryButton} ${selectedCategory === category ? styles.categoryActive : ""
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* COLOR MODIFIERS */}
            <p>Select modifiers:</p>
            <div>
                <label style={{ color: "red" }}>
                    Red
                    <input type="checkbox" name="red" onChange={handleChange} />
                </label>
                <label style={{ color: "green", marginLeft: "10px" }}>
                    Green
                    <input type="checkbox" name="green" onChange={handleChange} />
                </label>
                <label style={{ color: "#0178bd", marginLeft: "10px" }}>
                    Blue
                    <input type="checkbox" name="blue" onChange={handleChange} />
                </label>
            </div>

            {/* MONSTER GRID */}
            <div className={styles.monsterGrid}>
                {filteredMonsters.map(monster => {
                    //const quantity = quantities[monster.id] || 1;

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

            <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}/*Modal for exorcism*/>
                <h2>⚠️ Exorcism Ritual</h2>
                <p>This will banish all monsters.</p>

                <button
                    className={styles.mybutton}
                    style={{ backgroundColor: "crimson" }}
                    onClick={handleExorcism}
                >
                    Yes, Exorcise
                </button>

                <button
                    className={styles.mybutton}
                    style={{ backgroundColor: "#777" }}
                    onClick={() => setConfirmOpen(false)}
                >
                    Cancel
                </button>
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