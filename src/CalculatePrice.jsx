import monsterData from "./monsterData";

const COLOR_PRICE = 5;

function CalculatePrice(monsterId, colors) {
  const monster = monsterData.find(m => m.id === monsterId);

  const base = monster?.price || 0;

  const colorCost = colors.includes("normal")
    ? 0
    : colors.length * COLOR_PRICE;

  return base + colorCost;
}

export default CalculatePrice;