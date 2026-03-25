import { Outlet, NavLink } from 'react-router-dom';

function MonsterPics() {
    const navLinkStyles = ({ isActive }) => ({
    color: isActive ? '#DC143C' : 'inherit',
    textDecoration: isActive ? 'none' : 'underline',
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '5px 10px'
  });
  
  return (
    <div>
      <h1>Pictures of the Monsters we provide</h1>
      <nav style={{ marginBottom: '20px' }}>
        <NavLink to="/monsterpics/vampire" style={navLinkStyles}>Vampire</NavLink> |{" "}
        <NavLink to="/monsterpics/ghost" style={navLinkStyles}>Ghost</NavLink> |{" "}
        <NavLink to="/monsterpics/zombie" style={navLinkStyles}>Zombie</NavLink> |{" "}
        <NavLink to="/monsterpics/ghoul" style={navLinkStyles}>Ghoul</NavLink> |{" "}
        <NavLink to="/monsterpics/lich" style={navLinkStyles}>Lich</NavLink> |{" "}
        <NavLink to="/monsterpics/imp" style={navLinkStyles}>Imp</NavLink> |{" "}
        <NavLink to="/monsterpics/succubus" style={navLinkStyles}>Succubus</NavLink> |{" "}
        <NavLink to="/monsterpics/hellhound" style={navLinkStyles}>Hellhound</NavLink> |{" "}
        <NavLink to="/monsterpics/goblin" style={navLinkStyles}>Goblin</NavLink> |{" "}
        <NavLink to="/monsterpics/orc" style={navLinkStyles}>Orc</NavLink> |{" "}
        <NavLink to="/monsterpics/troll" style={navLinkStyles}>Troll</NavLink> |{" "}
        <NavLink to="/monsterpics/werewolf" style={navLinkStyles}>Werewolf</NavLink>{" "}
        <NavLink to="/monsterpics/giantSpider" style={navLinkStyles}>Giant Spider</NavLink>{" "}
        <NavLink to="/monsterpics/direWolf" style={navLinkStyles}>Dire Wolf</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}

export default MonsterPics;