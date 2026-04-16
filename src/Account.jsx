import { useEffect, useState } from "react";

function Account({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    const savedOrders = localStorage.getItem(`orders_${user.email}`);
    setOrders(savedOrders ? JSON.parse(savedOrders) : []);
  }, [user]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>My Account</h1>

      <h2>User Info</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

    </div>
  );
}

export default Account;