/**
 * Calculates the total cost of all monsters in the horde.
 * @param {Array} horde - Array of horde items, each with price and quantity
 * @returns {number} Total cost across all items
 */
export function calculateHordeTotal(horde) {
    return horde.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
}