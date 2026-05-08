import { useState } from "react";
import ToastContext from "./ToastContext";

function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (text) => {
        const id = crypto.randomUUID();

        const newToast = {
            id,
            text
        };

        setToasts((prev) => {
            // Prevent too many at once
            if (prev.length >= 3) {
                return prev;
            }

            return [...prev, newToast];
        });

        setTimeout(() => {
            setToasts((prev) =>
                prev.map((toast) =>
                    toast.id === id
                        ? { ...toast, exiting: true }
                        : toast
                )
            );

            // Remove AFTER exit animation
            setTimeout(() => {
                setToasts((prev) =>
                    prev.filter((toast) => toast.id !== id)
                );
            }, 300);

        }, 2500);
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export default ToastProvider;