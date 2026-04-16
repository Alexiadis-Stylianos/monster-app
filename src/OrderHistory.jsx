import { useEffect, useState } from "react";
import { pluralizeMonster } from "./monsterPlurals";

function OrderHistory({ user }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!user) return;

        const saved =
            JSON.parse(localStorage.getItem(`orders_${user.email}`)) || [];

        setOrders(saved.reverse());
    }, [user]);

    if (orders.length === 0) {
        return <p>No orders yet.</p>;
    }

    return (
        <div style={{ textAlign: "center" }}>
            <h1>My Orders</h1>

            {orders.map(order => (
                <div
                    key={order.id}
                    style={{
                        border: "1px solid #ccc",
                        margin: "10px",
                        padding: "10px",
                        borderRadius: "6px"
                    }}
                >
                    <p><strong>Date:</strong> {order.date}</p>
                    <p><strong>Total:</strong> {order.total}€</p>

                    {order.items.map((item, index) => (
                        <p key={index}>
                            {item.quantity} x {pluralizeMonster(item.monster, item.quantity)} ({item.colors.join(", ")})
                        </p>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default OrderHistory;