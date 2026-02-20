import { createPortal } from 'react-dom';
import { useEffect } from "react";
import styles from "./Styles.module.css";

function Modal({ isOpen, onClose, children }) {
  // ESC key close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalBackdrop}
      onClick={onClose} // click outside
    >
      <div className={styles.modalContent}
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {children}
        <button onClick={onClose}
          className={styles.modalClose}
          aria-label="Close modal"
        >
          X
        </button>
      </div>
    </div>,
    document.body
  );
}

export default Modal;