import { getFromStorage, saveToStorage } from "../hooks/useLocalStorage";

/**
 * Retrieves all registered users from storage.
 * @returns {Array} Array of user objects, or empty array if none exist
 */
export function getUsers() {
    return getFromStorage("users", []);
}

/**
 * Saves users list to storage.
 * @param {Array} users - Array of user objects to persist
 */
export function saveUsers(users) {
    saveToStorage("users", users);
}

/**
 * Finds a user by email address.
 * @param {string} email - User email to search for
 * @returns {Object|undefined} User object if found, undefined otherwise
 */
export function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email === email);
}

/**
 * Adds a new user to the stored users list.
 * @param {Object} newUser - User object with name, email, and password
 */
export function addUser(newUser) {
    const users = getUsers();
    saveUsers([...users, newUser]);
}

/**
 * Validates user credentials against stored data.
 * WARNING: This stores passwords in plaintext. For production, use bcrypt or similar.
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} { user } on success or { error: message } on failure
 */
export function validateUser(email, password) {
    const user = findUserByEmail(email);

    if (!user) return { error: "User not found" };

    // WARNING: Plain text comparison - passwords are stored unencrypted!
    if (user.password !== password) {
        return { error: "Incorrect password" };
    }

    return { user };
}

/**
 * Stores the currently logged-in user in storage.
 * Called after successful login.
 * @param {Object} user - User object to mark as current
 */
export function setCurrentUser(user) {
    saveToStorage("currentUser", user);
}