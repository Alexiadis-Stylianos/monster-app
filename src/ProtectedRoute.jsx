import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "./hooks/useToast";

function ProtectedRoute({ user, children }) {
    const { addToast } = useToast();
    useEffect(() => {
        if (!user) {
            addToast("Please login first");
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;