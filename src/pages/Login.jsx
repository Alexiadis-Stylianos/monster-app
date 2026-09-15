import { useForm } from "react-hook-form";
import styles from "../Styles.module.css";
import { useNavigate } from "react-router-dom";
import { validateUser, setCurrentUser } from "../utils/auth";
import { useToast } from "../hooks/useToast";

function Login({ setUser }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();
    const { addToast } = useToast();

    const onSubmit = (data) => {
        // Validate credentials against stored user data
        const result = validateUser(data.email, data.password);

        if (result.error) {
            addToast(result.error);
            return;
        }

        // Persist logged-in user to storage and update app state
        setCurrentUser(result.user);
        setUser(result.user);

        addToast("Login successful");

        // Redirect to shop after successful login
        navigate("/");
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.formContainer}
        >
            <h2 className={styles.formTitle}>Login</h2>

            <div className={styles.formGroup}>
                <label
                    htmlFor="login-email"
                    className={styles.formLabel}
                >
                    Email
                </label>

                <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    className={styles.formInput}
                    placeholder="you@example.com"
                    {...register("email", {
                        required: "Email required"
                    })}
                />
                <p className={styles.errorText}>
                    {errors.email?.message}
                </p>
            </div>

            <div className={styles.formGroup}>
                <label
                    htmlFor="login-password"
                    className={styles.formLabel}
                >
                    Password
                </label>

                <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    className={styles.formInput}
                    placeholder="Enter password"
                    {...register("password", {
                        required: "Password required"
                    })}
                />
                <p className={styles.errorText}>
                    {errors.password?.message}
                </p>
            </div>

            <button
                type="submit"
                className={styles.mybutton}
            >
                Login
            </button>
        </form>
    );
}

export default Login;