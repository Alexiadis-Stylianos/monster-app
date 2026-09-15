import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../Styles.module.css";
import { findUserByEmail, addUser } from "../utils/auth";
import { useToast } from "../hooks/useToast";

function Register() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();
    const { addToast } = useToast();

    const onSubmit = (data) => {
        // Check if email is already registered
        const existingUser = findUserByEmail(data.email);

        if (existingUser) {
            addToast("Email already registered");
            return;
        }

        // Create new user with provided credentials
        const newUser = {
            name: data.name,
            email: data.email,
            password: data.password
        };

        // Save new user to storage and redirect to login
        addUser(newUser);
        addToast("Registration successful. Please log in.");
        navigate("/login");
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.formContainer}
        >
            <h2 className={styles.formTitle}>Register</h2>

            <div className={styles.formGroup}>
                <label
                    htmlFor="register-name"
                    className={styles.formLabel}
                >
                    Name
                </label>

                <input
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    className={styles.formInput}
                    placeholder="Enter your name"
                    aria-invalid={errors.name ? "true" : "false"}
                    {...register("name", {
                        required: "Name required"
                    })}
                />
                <p className={styles.errorText}>
                    {errors.name?.message}
                </p>
            </div>

            <div className={styles.formGroup}>
                {/* EMAIL */}
                <label htmlFor="register-email">
                    Email
                </label>

                <input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    className={styles.formInput}
                    placeholder="Enter your email"
                    aria-invalid={errors.email ? "true" : "false"}
                    {...register("email", {
                        required: "Email required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format"
                        }
                    })}
                />
                <p className={styles.errorText}>
                    {errors.email?.message}
                </p>
            </div>

            <div className={styles.formGroup}>
                <label
                    htmlFor="register-password"
                    className={styles.formLabel}
                >
                    Password
                </label>

                <input
                    id="register-password"
                    type="password"
                    autoComplete="current-password"
                    className={styles.formInput}
                    placeholder="Enter password"
                    aria-invalid={errors.password ? "true" : "false"}
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
                Register
            </button>
        </form>
    );
}

export default Register;