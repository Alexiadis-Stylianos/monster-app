import { useForm } from "react-hook-form";
import styles from "./Styles.module.css";
import { useNavigate } from "react-router-dom";

function Login({ setUser, setToastMessage }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = (data) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const foundUser = users.find(user => user.email === data.email);

        if (!foundUser) {
            setToastMessage("User not found");
            return;
        }

        if (foundUser.password !== data.password) {
            setToastMessage("Incorrect password");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        setUser(foundUser);

        setToastMessage("Login successful!");

        navigate("/");      // redirect to shop
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Login</h2>

            <input
                placeholder="Email"
                {...register("email", { required: "Email required" })}
            />
            <p>{errors.email?.message}</p>

            <input
                type="password"
                placeholder="Password"
                {...register("password", { required: "Password required" })}
            />
            <p>{errors.password?.message}</p>

            <button
                type="submit"
                className={styles.mybutton}>
                Login
            </button>
        </form>
    );
}

export default Login;