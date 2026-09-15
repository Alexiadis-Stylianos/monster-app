import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "../hooks/useToast";

/**
 * Protects routes that require authentication.
 * Redirects unauthenticated users to home page and shows notification.
 * @param {Object} user - Current user object or null
 * @param {React.ReactNode} children - Child component to render if authenticated
 */
function ProtectedRoute({ user, children }) {
    const { addToast } = useToast();

    // Notify user if they try to access a protected route without logging in
    useEffect(() => {
        if (!user) {
            addToast("Please login first");
        }
    }, [user, addToast]);

    // Redirect to home if not authenticated
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;