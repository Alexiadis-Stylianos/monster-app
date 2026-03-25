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
import FlipCard from "./FlipCard";

export function Vampire(){
  return(
    <>
    <h1>A Vampire picture</h1>
    <FlipCard
        image={vampire}
        title="Vampire"
        lore="Ancient nocturnal beings who feed on blood."
      />
    </>
  )
}

export function Zombie(){
  return(
    <>
    <h1>A Zombie picture</h1>
    <FlipCard
        image={zombie}
        title="Zombie"
        lore="Undead creatures that constantly crave brains."
      />
    </>
  )
}

export function Ghost(){
  return(
    <>
    <h1>A Ghost picture</h1>
    <FlipCard
        image={ghost}
        title="Ghost"
        lore="Spirits of the dead, with lingering regrets."
      />
    </>
  )
}

export function Ghoul(){
  return(
    <>
    <h1>A Ghoul picture</h1>
    <FlipCard
        image={ghoul}
        title="Ghoul"
        lore="Living humans that were turned to thralls by a vampire."
      />
    </>
  )
}

export function Lich(){
  return(
    <>
    <h1>A Lich picture</h1>
    <FlipCard
        image={lich}
        title="Lich"
        lore="Undead wizards who have stored their soul in a phylactery."
      />
    </>
  )
}

export function Imp(){
  return(
    <>
    <h1>An Imp picture</h1>
    <FlipCard
        image={imp}
        title="Imp"
        lore="Small, lower-class devils."
      />
    </>
  )
}

export function Succubus(){
  return(
    <>
    <h1>A Succubus picture</h1>
    <FlipCard
        image={succubus}
        title="Succubus"
        lore="Female demons with powerful illusion magic."
      />
    </>
  )
}

export function Hellhound(){
  return(
    <>
    <h1>A Hellhound picture</h1>
    <FlipCard
        image={hellhound}
        title="Hellhound"
        lore="Hounds of fire and darkness, guardians of hell."
      />
    </>
  )
}

export function Goblin(){
  return(
    <>
    <h1>A Goblin picture</h1>
    <FlipCard
        image={goblin}
        title="Goblin"
        lore="Small, groteseque and mischievous creatures."
      />
    </>
  )
}

export function Orc(){
  return(
    <>
    <h1>A Orc picture</h1>
    <FlipCard
        image={orc}
        title="Orc"
        lore="Bigger than goblins and more brutish."
      />
    </>
  )
}

export function Troll(){
  return(
    <>
    <h1>A Troll picture</h1>
    <FlipCard
        image={troll}
        title="Troll"
        lore="Ugly and slow-witty, often found near bridges. Their favorite weapon is the club."
      />
    </>
  )
}

export function Werewolf(){
  return(
    <>
    <h1>A Werewolf picture</h1>
    <FlipCard
        image={werewolf}
        title="Werewolf"
        lore="Half-man, half-wolf when under the full moon's light; these creatures eat their prey's hearts."
      />
    </>
  )
}

export function GiantSpider(){
  return(
    <>
    <h1>A Giant Spider picture</h1>
    <FlipCard
        image={giantSpider}
        title="Giant Spiderf"
        lore="Spiders the size of a truck."
      />
    </>
  )
}

export function DireWolf(){
  return(
    <>
    <h1>A Dire Wolf picture</h1>
    <FlipCard
        image={direWolf}
        title="Dire Wolf"
        lore="Wolves with greater biting force than normal ones. Often companions of orcs and goblins."
      />
    </>
  )
}