import { useEffect, useState } from "react";
import { getFromStorage } from "../hooks/useLocalStorage";

function Account({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Retrieve user's past orders from persistent storage
    const savedOrders = getFromStorage(`orders_${user.email}`, []);
    setOrders(savedOrders);
  }, [user]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>My Account</h1>

      <h2>User Info</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h2>Order History</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <strong>Order #{order.id}</strong> - {order.date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default Account;