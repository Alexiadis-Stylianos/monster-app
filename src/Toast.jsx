import { useEffect, useState } from "react";
import styles from "./Styles.module.css";

function Toast({ toast }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const statusClass = toast.exiting
    ? styles.toastExit
    : visible
      ? styles.toastVisible
      : styles.toastHidden;

  return (
    <div className={`${styles.toast} ${statusClass}`}>
      {toast.text}
    </div>
  );
}

export default Toast;