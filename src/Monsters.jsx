import zombie from './zombie.jpg';
import vampire from './vampire.jpg';
import ghost from './ghost.jpg';
import werewolf from './werewolf.webp'
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