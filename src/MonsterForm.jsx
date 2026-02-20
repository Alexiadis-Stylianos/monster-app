import { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import styles from "./Styles.module.css";
import scream from './assets/sounds/scream.wav';
import growl from './assets/sounds/growl.wav';
import exorcism from './assets/sounds/exorcism.wav';
import { useSound } from "./SoundContext";
import CalculatePrice from "./CalculatePrice";
import { pluralizeMonster } from "./monsterPlurals";

function MonsterForm({ setHorde, purchased, setPurchased }) {
    const [inputs, setInputs] = useState({});
    const [selectedMonster, setSelectedMonster] = useState("ghost");
    const [showText, setShowText] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [holyEffect, setHolyEffect] = useState(false);
    const [quantity, setQuantity] = useState(1);

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

    const { register, play, stop } = useSound();

    const screamAudio = useRef(new Audio(scream));
    const growlAudio = useRef(new Audio(growl));
    const exorcismAudio = useRef(new Audio(exorcism));

    useEffect(() => {
        register(screamAudio.current);
        register(growlAudio.current);
        register(exorcismAudio.current);
    }, []);


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

    //Hover features
    const handleHoverEnter = () => {
        setShowText(true);
        if (growlAudio.current.paused) {
            play(growlAudio.current);
        }
    };

    const handleHoverLeave = () => {
        setShowText(false);
        stop(growlAudio.current);
    }

    //formatting
    const formatList = (arr) => {
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return arr.join(" and ");
        return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
    };

    const handleHire = () => {
        const colors = getSelectedColors();
        const price = CalculatePrice(selectedMonster, colors);

        play(screamAudio.current);

        setHorde(prev => {
            const existingIndex = prev.findIndex(
                m =>
                    m.monster === selectedMonster &&
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
                    monster: selectedMonster,
                    colors,
                    price,
                    quantity
                }
            ];
        });

        setModalMessage(
            `${quantity} x ${formatList(colors)} ${pluralizeMonster(selectedMonster, quantity)} added to your Horde (${price * quantity}€)`
        );

        setModalOpen(true);
        setQuantity(1); // reset after adding
    };

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <p>Select monster colors:</p>
            <div>
                <label style={{ color: "red" }}>
                    Red
                    <input
                        type="checkbox"
                        name="red"
                        checked={inputs.red || false}
                        onChange={handleChange}
                    />
                </label>
                <label style={{ color: "green", marginLeft: "10px" }}>
                    Green
                    <input
                        type="checkbox"
                        name="green"
                        checked={inputs.green || false}
                        onChange={handleChange}
                    />
                </label>
                <label style={{ color: "#0178bd", marginLeft: "10px" }}>
                    Blue
                    <input
                        type="checkbox"
                        name="blue"
                        checked={inputs.blue || false}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <br />
            <div>
                {
                    ["ghost", "zombie", "werewolf", "vampire"].map(monster => (
                        <label key={monster} style={{ marginRight: "10px" }}>
                            <input
                                type="radio"
                                value={monster}
                                checked={selectedMonster === monster}
                                onChange={() => setSelectedMonster(monster)}
                            />
                            {monster}
                        </label>
                    ))
                }
            </div>
            <br />
            <div style={{ margin: "10px 0" }}>
                <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className={styles.quantityButton}
                >
                    -
                </button>
                <span style={{ margin: "0 10px" }}>{quantity}</span>
                <button
                    type="button"
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
                onClick={handleHire}
            >
                Hire a Monster!
            </button>

            {showText && <div className={styles.hover} >*Growl*</div>}

            <button
                className={styles.exorcismbutton}
                disabled={!purchased}
                onClick={() => setConfirmOpen(true)}
            >
                Exorcism (Free)
            </button>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <h2>Added to Horde</h2>
                <p>{modalMessage}</p>
            </Modal>

            <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)}/*Modal for exorcism*/>
                <h2>⚠️ Exorcism Ritual</h2>
                <p>This will banish all the monsters that are after you.</p>

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

            {/*Holy lights for exorcism*/holyEffect && (
                <div className={styles.holyContainer}>
                    {Array.from({ length: 75 }).map((_, i) => (
                        <span
                            key={i}
                            className={styles.holyParticle}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${60 + Math.random() * 30}%`,
                                animationDelay: `${Math.random() * 0.5}s`
                            }}
                        ></span>
                    ))}
                </div>
            )}
        </div >
    );
}
export default MonsterForm;