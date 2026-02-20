const MONSTER_PRICES = {
  ghost: 5,
  zombie: 10,
  werewolf: 10,
  vampire: 15
};

const COLOR_PRICE = 5;

function CalculatePrice(monster, colors) {
  const base = MONSTER_PRICES[monster] || 0;
  const colorCost = colors.includes("normal") ? 0 : colors.length * COLOR_PRICE;
  return (base + colorCost);
}

export default CalculatePrice;