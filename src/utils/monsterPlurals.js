/**
 * Converts a monster name to plural form based on quantity.
 * Uses English pluralization rules to handle common cases.
 * @param {string} name - Monster name (singular)
 * @param {number} quantity - Number of monsters
 * @returns {string} Singular if quantity is 1, otherwise pluralized form
 */
export function pluralizeMonster(name, quantity) {
  if (quantity === 1) return name;

  // Apply English pluralization rules
  if (name.endsWith("y")) return name.slice(0, -1) + "ies";
  if (name.endsWith("f")) return name.slice(0, -1) + "ves";
  if (name.endsWith("fe")) return name.slice(0, -2) + "ves";
  if (name.endsWith("s") || name.endsWith("x") || name.endsWith("ch") || name.endsWith("sh")) {
    return name + "es";
  }

  // Default: add 's'
  return name + "s";
}
