import { Navigate } from "react-router-dom";
import { useEffect } from "react";

function ProtectedRoute({ user, children, setToastMessage }) {
    useEffect(() => {
        if (!user) {
            setToastMessage?.("Please login first");
        }
    }, [user]);

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;