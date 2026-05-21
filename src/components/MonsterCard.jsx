import { useState, useEffect, useRef } from "react";
import styles from "../Styles.module.css";
import growl from '../assets/sounds/growl.wav';
import { useSound } from "../hooks/useSound";
import { useAudio } from "../hooks/useAudio";
import CalculatePrice from "./CalculatePrice";
import { MAX_QUANTITY } from "../utils/constants";
import QuantityStepper from "./QuantityStepper";

function MonsterCard({ monster, horde, onAdd }) {
    const [quantity, setQuantity] = useState(1);
    const growlAudio = useAudio(growl);
    const { register, play, stop } = useSound();

    //Hover features
    const handleHoverEnter = () => {
        const audio = growlAudio.current;

        if (!audio) return;

        if (audio.readyState < 2) return;

        if (!audio.paused) return;

        play(audio);
    };

    const handleHoverLeave = () => {
        stop(growlAudio.current);
    }

    //Handle colors
    const [colors, setColors] = useState({
        red: false,
        green: false,
        blue: false
    });

    const handleColorChange = (e) => {
        const { value, checked } = e.target;

        setColors(prev => ({
            ...prev,
            [value]: checked
        }));
    };

    const getSelectedColors = () => {
        const selected = [];

        if (colors.red) selected.push("red");
        if (colors.green) selected.push("green");
        if (colors.blue) selected.push("blue");

        return selected.length ? selected : ["normal"];
    };

    //Quantity input field
    const handleInputChange = (value) => {
        const num = parseInt(value, 10);

        // Prevent invalid values
        if (isNaN(num)) {
            setQuantity("");
            return;
        }

        // Minimum value enforcement
        if (num < 1) {
            setQuantity(1);
            return;
        }

        if (num > MAX_QUANTITY) {
            setQuantity(MAX_QUANTITY);
            return;
        }

        setQuantity(num);
    };

    const selectedColors = getSelectedColors();
    const existingItem = horde.find(m => {
        const sameMonster = m.monster === monster.id;

        const sortedA = [...m.colors].sort();
        const sortedB = [...selectedColors].sort();

        return sameMonster && JSON.stringify(sortedA) === JSON.stringify(sortedB);
    });

    const currentQty = existingItem ? existingItem.quantity : 0;

    const isMaxReached = currentQty >= MAX_QUANTITY;
    const unitPrice = CalculatePrice(monster.id, selectedColors);
    const totalPrice = unitPrice * (quantity || 1);

    const handleAddClick = () => {
        onAdd(monster, quantity || 1, getSelectedColors());

        // reset everything to default
        setColors({
            red: false,
            green: false,
            blue: false
        });

        setQuantity(1);
    };

    useEffect(() => {
        if (growlAudio.current) {
            register(growlAudio.current);
        }
    }, [growlAudio, register]);

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
            <p>Total: {totalPrice}€</p>

            <div>
                <label
                    htmlFor={`red-${monster.id}`}
                    style={{ color: "red" }}
                >
                    Red
                </label>

                <input
                    id={`red-${monster.id}`}
                    type="checkbox"
                    name={`red-${monster.id}`}
                    value="red"
                    checked={colors.red}
                    onChange={handleColorChange}
                />

                <label
                    htmlFor={`green-${monster.id}`}
                    style={{ color: "green", marginLeft: "10px" }}
                >
                    Green
                </label>

                <input
                    id={`green-${monster.id}`}
                    type="checkbox"
                    name={`green-${monster.id}`}
                    value="green"
                    checked={colors.green}
                    onChange={handleColorChange}
                />

                <label
                    htmlFor={`blue-${monster.id}`}
                    style={{ color: "#0178bd", marginLeft: "10px" }}
                >
                    Blue
                </label>

                <input
                    id={`blue-${monster.id}`}
                    type="checkbox"
                    name={`blue-${monster.id}`}
                    value="blue"
                    checked={colors.blue}
                    onChange={handleColorChange}
                />
            </div>

            {/* QUANTITY */}
            <div className={styles.shopActions}>

                <QuantityStepper
                    value={quantity}
                    onChange={(updater) => {
                        setQuantity(prev =>
                            typeof updater === "function"
                                ? updater(prev)
                                : updater
                        );
                    }}
                    small={true}
                />

                <button
                    className={styles.mybutton}
                    onMouseEnter={handleHoverEnter}
                    onMouseLeave={handleHoverLeave}
                    onClick={handleAddClick}
                    disabled={isMaxReached}
                >
                    {isMaxReached ? "Max reached" : "Add to Horde"}
                </button>

            </div>
        </div>
    );
}

export default MonsterCard;