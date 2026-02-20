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
        <NavLink to="/monsterpics/werewolf" style={navLinkStyles}>Werewolf</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}

export default MonsterPics;