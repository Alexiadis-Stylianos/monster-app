import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { useState, useRef, useEffect } from "react";
import styles from "./Styles.module.css";
import { pluralizeMonster } from "./monsterPlurals";

function MonsterHorde({ horde, setHorde }) {
  const navigate = useNavigate();
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [removeItemConfirm, setRemoveItemConfirm] = useState(null);
  const [removeAmountConfirm, setRemoveAmountConfirm] = useState(null);
  // { index, amount }
  const [removeAmounts, setRemoveAmounts] = useState({});
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

  //ENTER confirms removal of items
  const clearConfirmRef = useRef(null);
  const removeConfirmRef = useRef(null);
  useEffect(() => {
    if (clearConfirmOpen) {
      setTimeout(() => {
        clearConfirmRef.current?.focus();
      }, 0);
    }
  }, [clearConfirmOpen]);

  useEffect(() => {
    if (removeItemConfirm) {
      setTimeout(() => {
        removeConfirmRef.current?.focus();
      }, 0);
    }
  }, [removeItemConfirm]);

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
              setRemoveItemConfirm({ index: i, item: m })
            }
            style={{ marginLeft: "5px" }}
            className={styles.mybutton}
          >
            Remove All
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
            className={styles.mybutton}>
            Go to Checkout
          </button>
        </>
      )}

      {/*Modal for clearing everything*/}
      <Modal
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
      >
        <h2>⚠️ Clear Entire Horde?</h2>
        <p>This will remove ALL monsters from your Horde.</p>
        <button
          ref={clearConfirmRef}
          onClick={() => {
            setHorde([]);
            setClearConfirmOpen(false);
          }}
          className={styles.mybutton}
          style={{ backgroundColor: "crimson" }}
        >
          Yes, Clear All
        </button>
        <button
          onClick={() => setClearConfirmOpen(false)}
          className={styles.mybutton}
          style={{ backgroundColor: "#777" }}
        >
          Cancel
        </button>
      </Modal>

      {/*Remove all modal*/}
      <Modal
        isOpen={!!removeItemConfirm}
        onClose={() => setRemoveItemConfirm(null)}
      >
        {removeItemConfirm && (
          <>
            <h2>⚠️ Remove Selection?</h2>
            <p>
              This will remove{" "}
              <strong>
                {removeItemConfirm.item.quantity}{" "}
                {formatList(removeItemConfirm.item.colors)}{" "}
                {pluralizeMonster(removeItemConfirm.item.monster, removeItemConfirm.item.quantity)}
              </strong>{" "}
              from your Horde.
            </p>

            <button
              ref={removeConfirmRef}
              onClick={() => {
                setHorde(prev =>
                  prev.filter((_, i) => i !== removeItemConfirm.index)
                );
                setRemoveItemConfirm(null);
              }}
              className={styles.mybutton}
              style={{ backgroundColor: "crimson" }}
            >
              Yes, Remove All
            </button>
            <button
              onClick={() => setRemoveItemConfirm(null)}
              className={styles.mybutton}
              style={{ backgroundColor: "#777" }}
            >
              Cancel
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
export default MonsterHorde;