import { useRef, useEffect } from "react";
import styles from "../Styles.module.css";
import { MAX_QUANTITY } from "../utils/constants";

function QuantityStepper({
    value,
    onChange,
    small = false,
    id: _idProp,
    name: _nameProp,
    idPrefix
}) {
    const holdTimeoutRef = useRef(null);
    const holdIntervalRef = useRef(null);
    const idRef = useRef(null);

    if (idRef.current === null) {
        // generate a stable-ish id for this instance
        idRef.current = _idProp || (idPrefix ? `${idPrefix}-quantity` : `quantity-${Math.random().toString(36).slice(2,9)}`);
    }

    const clampValue = (num) => {
        return Math.max(1, Math.min(MAX_QUANTITY, num));
    };

    const changeValue = (amount) => {
        onChange(prev => {
            const nextValue = clampValue(prev + amount);
            return nextValue;
        });
    };

    const startHolding = (direction) => {
        let tick = 0;

        const runChange = () => {
            tick++;

            let step = 1;

            if (tick > 20) {
                step = 10;
            } else if (tick > 10) {
                step = 5;
            }

            changeValue(
                direction === "increase"
                    ? step
                    : -step
            );
        };

        // Immediate first action
        runChange();

        // Delay before rapid repeat starts
        holdTimeoutRef.current = setTimeout(() => {
            holdIntervalRef.current = setInterval(runChange, 100);
        }, 400);
    };

    const stopHolding = () => {
        clearTimeout(holdTimeoutRef.current);
        clearInterval(holdIntervalRef.current);
    };

    useEffect(() => {
        return () => {
            stopHolding();
        };
    }, []);

    const wrapperClass = small
        ? `${styles.quantityStepper} ${styles.quantityStepperSmall}`
        : styles.quantityStepper;

    return (
        <div className={wrapperClass}>

            <button
                type="button"
                disabled={value <= 1}
                className={`${styles.quantityButton} ${value <= 1
                    ? styles.quantityButtonDisabled
                    : styles.quantityButtonActive
                    }`}
                onMouseDown={() => startHolding("decrease")}
                onMouseUp={stopHolding}
                onMouseLeave={stopHolding}
                onTouchStart={() => startHolding("decrease")}
                onTouchEnd={stopHolding}
            >
                -
            </button>

            <input
                type="number"
                min="1"
                max={MAX_QUANTITY}
                value={value}
                onChange={(e) => {
                    const num = parseInt(e.target.value, 10);

                    if (isNaN(num)) {
                        onChange(1);
                        return;
                    }

                    onChange(clampValue(num));
                }}
                id={idRef.current}
                name={_nameProp || idRef.current}
                className={styles.quantityInput}
            />

            <button
                type="button"
                disabled={value >= MAX_QUANTITY}
                className={`${styles.quantityButton} ${value >= MAX_QUANTITY
                    ? styles.quantityButtonDisabled
                    : styles.quantityButtonActive
                    }`}
                onMouseDown={() => startHolding("increase")}
                onMouseUp={stopHolding}
                onMouseLeave={stopHolding}
                onTouchStart={() => startHolding("increase")}
                onTouchEnd={stopHolding}
            >
                +
            </button>

        </div>
    );
}

export default QuantityStepper;