import { useForm } from "react-hook-form";
import styles from "./Styles.module.css";
import { useNavigate } from "react-router-dom";
import { validateUser, setCurrentUser } from "./utils/auth";
import { useToast } from "./hooks/useToast";

function Login({ setUser }) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();
    const { addToast } = useToast();

    const onSubmit = (data) => {
        const result = validateUser(data.email, data.password);

        if (result.error) {
            // setToasts((prev) => [
            //     ...prev,
            //     { id: Date.now(), text: result.error }
            // ]);
            addToast(result.error);
            return;
        }

        setCurrentUser(result.user);
        setUser(result.user);

        // setToasts((prev) => [
        //     ...prev,
        //     { id: Date.now(), text: "Login successful." }
        // ]);
        addToast("Login successful");

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