export function pluralizeMonster(name, quantity) {
  if (quantity === 1) return name;

  // Smart fallback rules
  if (name.endsWith("y")) return name.slice(0, -1) + "ies";
  if (name.endsWith("f")) return name.slice(0, -1) + "ves";
  if (name.endsWith("fe")) return name.slice(0, -2) + "ves";
  if (name.endsWith("s") || name.endsWith("x") || name.endsWith("ch") || name.endsWith("sh")) {
    return name + "es";
  }

  return name + "s";
}
