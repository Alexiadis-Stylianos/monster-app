import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useState } from "react";
import styles from "./Styles.module.css";
import { pluralizeMonster } from "./utils/monsterPlurals";
import { formatList } from "./utils/formatList";
import { calculateHordeTotal } from "./utils/hordeUtils";
import QuantityStepper from "./components/QuantityStepper";

function MonsterHorde({ horde, setHorde, user }) {
  const navigate = useNavigate();
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [removeAmountConfirm, setRemoveAmountConfirm] = useState(null);
  const total = calculateHordeTotal(horde);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className={styles.hordeContainer}>
      <h1>Your Monster Horde</h1>
      {horde.length === 0 && <p>Your horde is empty...</p>}
      {horde.map((m, i) => (
        <div key={i} className={styles.hordeItem}>
          <div className={styles.hordeInfo}>
            <p>
              {m.quantity} x {formatList(m.colors)}{" "}
              {pluralizeMonster(m.monster, m.quantity)}
              {" — "}
              {m.price * m.quantity}€
            </p>
          </div>

          <div className={styles.hordeControls}>
            <div className={styles.quantityGroup}>
              <label
                htmlFor={`horde-quantity-${i}`}
                className={styles.quantityLabel}
              >
                Quantity
              </label>

              <QuantityStepper
                value={m.quantity}
                onChange={(updater) => {
                  setHorde(prev => {
                    const updated = [...prev];

                    const currentQuantity = updated[i].quantity;

                    updated[i].quantity =
                      typeof updater === "function"
                        ? updater(currentQuantity)
                        : updater;

                    return updated;
                  });
                }}
                id={`horde-quantity-${i}`}
                name={`horde-quantity-${i}`}
              />
            </div>

            <button
              onClick={() =>
                setRemoveAmountConfirm({
                  index: i,
                  amount: m.quantity
                })
              }
              className={styles.mybutton}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <h3>Total: {total}€</h3>

      {horde.length > 0 && (
        <>
          <button
            onClick={() => setClearConfirmOpen(true)}
            style={{ marginRight: "10px" }}
            className={styles.mybutton}
          >
            Clear All
          </button>

          <button
            onClick={handleCheckout}
            className={styles.mybutton}
            disabled={!user}>
            Go to Checkout
          </button>
        </>
      )}

      {/*Modal for clearing everything*/}
      <Modal
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={() => {
          setHorde([]);
          setClearConfirmOpen(false);
        }}
      >
        {({ selected, onClose, onConfirm }) => (
          <>
            <h2>Clear Entire Horde?</h2>
            <p>This will remove ALL monsters from your Horde.</p>

            <button
              data-action="confirm"
              onClick={onConfirm}
              className={`${styles.mybutton} ${selected === "confirm" ? styles.modalSelected : ""
                }`}
              style={{ backgroundColor: "crimson" }}
            >
              Yes, Clear All
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

      {/*Remove all modal*/}
      <Modal
        isOpen={!!removeAmountConfirm}
        onClose={() => setRemoveAmountConfirm(null)}
        onConfirm={() => {
          const { index, amount } = removeAmountConfirm;

          setHorde(prev => {
            const updated = [...prev];

            const safeAmount = Math.min(
              amount,
              updated[index].quantity
            );

            if (updated[index].quantity > safeAmount) {
              updated[index].quantity -= safeAmount;
            } else {
              updated.splice(index, 1);
            }

            return updated;
          });

          setRemoveAmountConfirm(null);
        }}
      >
        {({ selected, onClose, onConfirm }) => {
          if (!removeAmountConfirm) return null;

          const { index, amount } = removeAmountConfirm;
          const item = horde[index];

          return (
            <>
              <h2>Confirm Removal</h2>
              <p>
                Remove <strong>{amount}</strong>{" "}
                {formatList(item.colors)}{" "}
                {pluralizeMonster(item.monster, amount)}?
              </p>

              <button
                data-action="confirm"
                onClick={onConfirm}
                className={`${styles.mybutton} ${selected === "confirm" ? styles.modalSelected : ""
                  }`}
                style={{ backgroundColor: "crimson" }}
              >
                Yes, Remove
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
          );
        }}
      </Modal>
    </div>
  );
}
export default MonsterHorde;