export function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

export function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

export function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email === email);
}

export function addUser(newUser) {
    const users = getUsers();
    saveUsers([...users, newUser]);
}

export function validateUser(email, password) {
    const user = findUserByEmail(email);

    if (!user) return { error: "User not found" };

    if (user.password !== password) {
        return { error: "Incorrect password" };
    }

    return { user };
}

export function setCurrentUser(user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
}