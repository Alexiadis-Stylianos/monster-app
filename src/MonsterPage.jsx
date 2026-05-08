import { useParams } from "react-router-dom";
import { monsterLoreData } from "./data/monsterLoreData";
import FlipCard from "./FlipCard";

function MonsterPage() {
  const { type } = useParams();
  const monster = monsterLoreData[type];

  if (!monster) return <p>Monster not found</p>;

  return (
    <>
      <h1>A {monster.title} picture</h1>
      <FlipCard {...monster} />
    </>
  );
}

export default MonsterPage;