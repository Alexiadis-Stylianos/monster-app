import zombie from './zombie.jpg';
import vampire from './vampire.jpg';
import ghost from './ghost.jpg';
import ghoul from './ghoul.png'
import lich from './lich.jpg';
import imp from './imp.jpg';
import succubus from './succubus.jpg';
import hellhound from './hellhound.webp';
import goblin from './goblin.webp'
import orc from './orc.jpg';
import troll from './troll.jpg';
import werewolf from './werewolf.webp'
import giantSpider from './giant-spider.jpg';
import direWolf from './dire-wolf.jpg';

const monsterData = [
  { id: "ghost", name: "Ghost", price: 5, category: "Undead", image: ghost },
  { id: "zombie", name: "Zombie", price: 10, category: "Undead", image: zombie },
  { id: "vampire", name: "Vampire", price: 30, category: "Undead", image: vampire },
  { id: "ghoul", name: "Ghoul", price: 12, category: "Undead", image: ghoul },
  { id: "lich", name: "Lich", price: 30, category: "Undead", image: lich },

  { id: "imp", name: "Imp", price: 8, category: "Demon", image: imp },
  { id: "succubus", name: "Succubus", price: 20, category: "Demon", image: succubus },
  { id: "hellhound", name: "Hellhound", price: 18, category: "Demon", image: hellhound },

  { id: "goblin", name: "Goblin", price: 7, category: "Humanoid", image: goblin },
  { id: "orc", name: "Orc", price: 10, category: "Humanoid", image: orc },
  { id: "troll", name: "Troll", price: 12, category: "Humanoid", image: troll },

  { id: "werewolf", name: "Werewolf", price: 20, category: "Beast", image: werewolf },
  { id: "giant spider", name: "Giant Spider", price: 12, category: "Beast", image: giantSpider },
  { id: "direwolf", name: "Dire Wolf", price: 10, category: "Beast", image: direWolf }
];

export default monsterData;