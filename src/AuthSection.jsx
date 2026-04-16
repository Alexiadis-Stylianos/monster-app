import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Styles.module.css";

function AuthSection({ user, setUser, setToastMessage }) {
    const navigate = useNavigate();

    // Controls dropdown visibility
    const [open, setOpen] = useState(false);

    // Reference to detect outside clicks
    const dropdownRef = useRef(null);

    // Close dropdown if user clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.authContainer} ref={dropdownRef}>
            {/* Main Account Button */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className={styles.mybutton}
            >
                {user ? `Hi, ${user.name}` : "Account"}
            </button>

            {/* Dropdown */}
            {open && (
                <div className={styles.dropdown}>
                    {user ? (
                        <>
                            <button
                                onClick={() => {
                                    navigate("/account");
                                    setOpen(false);
                                }}
                                className={styles.dropdownItem}
                            >
                                My Account
                            </button>

                            <button
                                onClick={() => {
                                    navigate("/orders");
                                    setOpen(false);
                                }}
                                className={styles.dropdownItem}
                            >
                                Orders
                            </button>

                            <div className={styles.dropdownDivider}></div>

                            <button
                                onClick={() => {
                                    localStorage.removeItem("currentUser");
                                    setUser(null);
                                    setToastMessage("Logged out");
                                    setOpen(false);
                                }}
                                className={styles.dropdownItem}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    navigate("/login");
                                    setOpen(false);
                                }}
                                className={styles.dropdownItem}
                            >
                                Login
                            </button>

                            <button
                                onClick={() => {
                                    navigate("/register");
                                    setOpen(false);
                                }}
                                className={styles.dropdownItem}
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default AuthSection;