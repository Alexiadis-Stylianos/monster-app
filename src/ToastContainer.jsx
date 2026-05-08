import Toast from "./Toast";
import styles from "./Styles.module.css";
import { useToast } from "./hooks/useToast";

function ToastContainer() {
    const { toasts } = useToast();

    return (
        <div className={styles.toastContainer}>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                />
            ))}
        </div>
    );
}

export default ToastContainer;