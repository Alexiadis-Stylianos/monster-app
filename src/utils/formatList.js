/**
 * Formats an array of items as a human-readable list with proper grammar.
 * Examples: [red] => "red", [red, blue] => "red and blue", [red, blue, green] => "red, blue and green"
 * @param {Array} arr - Array of items to format
 * @returns {string} Formatted list string with commas and "and"
 */
export function formatList(arr) {
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr.join(" and ");
    return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
}