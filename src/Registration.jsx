import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./Styles.module.css";

function Register({ setToastMessage }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = (data) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const existingUser = users.find(user => user.email === data.email);

        if (existingUser) {
            setToastMessage("Email already registered");
            return;
        }

        const newUser = {
            name: data.name,
            email: data.email,
            password: data.password
        };

        localStorage.setItem("users", JSON.stringify([...users, newUser]));

        setToastMessage("Registration successful! Please log in.");
        navigate("/login");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Register</h2>

            {/* NAME */}
            <input
                placeholder="Name"
                {...register("name", {
                    required: "Name required"
                })}
            />
            <p>{errors.name?.message}</p>

            {/* EMAIL */}
            <input
                placeholder="Email"
                {...register("email", {
                    required: "Email required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format"
                    }
                })}
            />
            <p>{errors.email?.message}</p>

            {/* PASSWORD */}
            <input
                type="password"
                placeholder="Password"
                {...register("password", {
                    required: "Password required",
                    validate: (value) => {
                        if (value.length < 8) return "At least 8 characters";
                        if (!/[A-Z]/.test(value)) return "One uppercase letter required";
                        if (!/[0-9]/.test(value)) return "One number required";
                        return true;
                    }
                })}
            />
            <p>{errors.password?.message}</p>

            <button
                type="submit"
                className={styles.mybutton}>
                Register
            </button>
            
        </form>
    );
}

export default Register;