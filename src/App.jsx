import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import MonsterHorde from "./MonsterHorde";
import styles from "./Styles.module.css";
import { Vampire, Zombie, Ghost, Werewolf } from './Monsters';
import MonsterPics from './MonsterPics.jsx';
import Checkout from './Checkout';
import Toast from './Toast';
import About from './About.jsx';

const Monster = lazy(() => import('./MonsterForm'))

function App() {
  // Style function for active links 
  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? '#DC143C' : 'inherit',
    textDecoration: isActive ? 'none' : 'underline',
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '5px 10px'
  });

  const [horde, setHorde] = useState(() => {
    const saved = localStorage.getItem("horde");
    return saved ? JSON.parse(saved) : [];
  });

  const [purchased, setPurchased] = useState(() => {
    const saved = localStorage.getItem("purchased");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("horde", JSON.stringify(horde));
  }, [horde]);

  useEffect(() => {
    localStorage.setItem("purchased", JSON.stringify(purchased));
  }, [purchased]);

  const totalQuantity = horde.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  //Toast message
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toastMessage]);

  //Dark Mode
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <button
        className="theme-toggle"
        onClick={() =>
          setTheme((prev) => (prev === "light" ? "dark" : "light"))
        }
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      <nav className={styles.pagesCenter}>
        <NavLink to="/" style={navLinkStyles}>Hire a Monster</NavLink> |{" "}
        <NavLink to="/horde" style={navLinkStyles}>
          Monster Horde {totalQuantity > 0 && `(${totalQuantity})`}
        </NavLink> |{" "}
        <NavLink to="/about" style={navLinkStyles}>About</NavLink> |{" "}
        <NavLink to="/monsterpics" style={navLinkStyles}>Products</NavLink>
      </nav>
      <div className={styles.appCenter}>
        {toastMessage && <Toast message={toastMessage} />}
        <Routes>
          <Route path="/" element={
            <Suspense fallback={<div>Loading options...</div>}>
              <Monster
                setHorde={setHorde}
                purchased={purchased}
                setPurchased={setPurchased}
              />
            </Suspense>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/horde" element={
            <MonsterHorde
              horde={horde}
              setHorde={setHorde}
            />
          } />
          <Route path="/checkout" element={<Checkout
            setToastMessage={setToastMessage}
            horde={horde}
            setHorde={setHorde}
            setPurchased={setPurchased}
          />} />
          <Route path="/monsterpics" element={<MonsterPics />}>
            <Route path="vampire" element={<Vampire />} />
            <Route path="ghost" element={<Ghost />} />
            <Route path="zombie" element={<Zombie />} />
            <Route path="werewolf" element={<Werewolf />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;