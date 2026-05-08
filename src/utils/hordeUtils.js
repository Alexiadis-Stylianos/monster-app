export function calculateHordeTotal(horde) {
    return horde.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
}