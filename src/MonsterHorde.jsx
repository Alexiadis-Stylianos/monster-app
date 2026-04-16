import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useState, useRef, useEffect } from "react";
import styles from "./Styles.module.css";
import { pluralizeMonster } from "./monsterPlurals";

function MonsterHorde({ horde, setHorde, user }) {
  const navigate = useNavigate();
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [removeAmountConfirm, setRemoveAmountConfirm] = useState(null);
  // { index, amount }
  // will hold { index, item }
  const total = horde.reduce((sum, m) => sum + m.price * m.quantity, 0);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const formatList = (arr) => {
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr.join(" and ");
    return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
  };

  const handleQuantityChange = (index, value) => {
    const num = parseInt(value, 10);

    setHorde(prev => {
      const updated = [...prev];

      if (isNaN(num)) {
        updated[index].quantity = "";
      } else {
        updated[index].quantity = Math.max(1, num);
      }

      return updated;
    });
  };

  const handleQuantityBlur = (index) => {
    setHorde(prev => {
      const updated = [...prev];

      if (!updated[index].quantity || updated[index].quantity < 1) {
        updated[index].quantity = 1;
      }

      return updated;
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Your Monster Horde</h1>
      {horde.length === 0 && <p>Your horde is empty...</p>}
      {horde.map((m, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <p>
            {m.quantity} x {formatList(m.colors)} {pluralizeMonster(m.monster, m.quantity)} — {m.price * m.quantity}€
          </p>

          <input
            type="number"
            min="1"
            value={m.quantity}
            onChange={(e) => handleQuantityChange(i, e.target.value)}
            onBlur={() => handleQuantityBlur(i)}
            style={{ width: "60px", margin: "0 10px" }}
          />

          <button
            onClick={() =>
              setRemoveAmountConfirm({
                index: i,
                amount: m.quantity // default = remove all
              })
            }
            style={{ marginLeft: "5px" }}
            className={styles.mybutton}
          >
            Remove
          </button>
        </div>
      ))}

      <h3>Total: {total}€</h3>

      {horde.length > 0 && (
        <>
          <button
            onClick={() => setClearConfirmOpen(true)} style={{ marginRight: "10px" }}
            className={styles.mybutton}>
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
        {({ selected }) => (
          <>
            <h2>⚠️ Clear Entire Horde?</h2>
            <p>This will remove ALL monsters from your Horde.</p>

            <button
              className={`${styles.mybutton} ${selected === "confirm" ? styles.modalSelected : ""
                }`}
              style={{ backgroundColor: "crimson" }}
            >
              Yes, Clear All
            </button>

            <button
              onClick={() => setClearConfirmOpen(false)}
              className={`${styles.mybutton} ${selected === "cancel" ? styles.modalSelected : ""
                }`}
              style={{ backgroundColor: "#777" }}
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
        {({ selected }) => {
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
                className={`${styles.mybutton} ${selected === "confirm" ? styles.modalSelected : ""
                  }`}
                style={{ backgroundColor: "crimson" }}
              >
                Yes, Remove
              </button>

              <button
                onClick={() => setRemoveAmountConfirm(null)}
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