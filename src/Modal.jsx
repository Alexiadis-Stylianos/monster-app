import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./Styles.module.css";

function Modal({ isOpen, onClose, onConfirm, children }) {
  const modalRef = useRef(null);
  const lastFocusedElement = useRef(null);

  //track selected button
  const [selected, setSelected] = useState("cancel");
  const selectedRef = useRef("cancel");

  const getFocusableElements = () => {
    if (!modalRef.current) return [];

    return modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
  };

  useEffect(() => {
    if (!isOpen) return;

    lastFocusedElement.current = document.activeElement;

    const handleKeyDown = (e) => {
      //ESC key
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }

      //Arrow keys
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();

        setSelected(prev => {
          const next = prev === "confirm" ? "cancel" : "confirm";
          selectedRef.current = next;
          return next;
        });
      }

      //ENTER key
      if (e.key === "Enter") {
        e.preventDefault();

        if (selectedRef.current === "confirm") {
          onConfirm?.();
        } else {
          onClose();
        }
      }

      //TAB trap
      if (e.key === "Tab") {
        const focusable = getFocusableElements();

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          // SHIFT + TAB (backwards)
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          // TAB (forward)
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    setTimeout(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        modalRef.current?.focus();
      }
    }, 0);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedElement.current?.focus();
      setSelected("cancel");
      selectedRef.current = "cancel"; //reset
    };
  }, [isOpen, onClose, onConfirm]); //removed selected

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

        {/*Inject selection state into children */}
        {typeof children === "function"
          ? children({ selected })
          : children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;