import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import styles from "./Styles.module.css";

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // ESC key + focus handling
  useEffect(() => {
    if (!isOpen) return;

    lastFocusedElement.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // focus modal
    setTimeout(() => {
      modalRef.current?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.modalBackdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.modalContent}
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={styles.modalClose}
          aria-label="Close modal"
        >
          X
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;