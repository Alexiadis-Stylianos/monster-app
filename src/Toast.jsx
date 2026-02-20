import styles from "./Styles.module.css";

function Toast({ message }) {
  return (
    <div className={styles.toast}>
      {message}
    </div>
  );
}

export default Toast;
