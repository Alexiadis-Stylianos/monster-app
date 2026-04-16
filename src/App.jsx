import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import MonsterHorde from "./MonsterHorde";
import styles from "./Styles.module.css";
import { Vampire, Zombie, Ghost, Ghoul, Lich, Imp, Succubus, Hellhound, Goblin, Orc, Troll, Werewolf, GiantSpider, DireWolf } from './Monsters';
import MonsterPics from './MonsterPics.jsx';
import Checkout from './Checkout';
import Toast from './Toast';
import About from './About.jsx';
import Register from "./Registration.jsx";
import Login from "./Login";
import ProtectedRoute from './ProtectedRoute.jsx';
import OrderHistory from "./OrderHistory";
import Account from "./Account";
import AuthSection from './AuthSection.jsx';

const Monster = lazy(() => import('./MonsterForm'))

function App() {
  // Style function for active links 
  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? '#DC143C' : 'inherit',
    textDecoration: isActive ? 'none' : 'underline',
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '5px 10px'
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [horde, setHorde] = useState([]);
  useEffect(() => {
    if (!user) {
      setHorde([]);
      return;
    }

    const saved = localStorage.getItem(`horde_${user.email}`);
    setHorde(saved ? JSON.parse(saved) : []);
  }, [user]);

  const [purchased, setPurchased] = useState(() => {
    const saved = localStorage.getItem("purchased");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (!user) return;

    localStorage.setItem(
      `horde_${user.email}`,
      JSON.stringify(horde)
    );
  }, [horde, user]);

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
      <AuthSection
        user={user}
        setUser={setUser}
        setToastMessage={setToastMessage}
      />
      <button
        className="theme-toggle"
        onClick={() =>
          setTheme((prev) => (prev === "light" ? "dark" : "light"))
        }
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      <nav className={styles.pagesCenter}>
        <NavLink to="/" style={navLinkStyles}>Shop</NavLink> |{" "}
        <NavLink to="/horde" style={navLinkStyles}>
          Monster Horde {totalQuantity > 0 && `(${totalQuantity})`}
        </NavLink> |{" "}
        <NavLink to="/about" style={navLinkStyles}>About</NavLink> |{" "}
        <NavLink to="/monsterpics" style={navLinkStyles}>Products</NavLink>
      </nav>
      <div className={styles.appCenter}>
        {toastMessage && <Toast message={toastMessage} />}
        <Routes>
          <Route
            path="/account"
            element={
              <ProtectedRoute user={user} setToastMessage={setToastMessage}>
                <Account
                  user={user}
                  setUser={setUser}
                  setToastMessage={setToastMessage}
                />
              </ProtectedRoute>
            }
          />
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
              user={user}
            />
          } />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute user={user} setToastMessage={setToastMessage}>
                <Checkout
                  setToastMessage={setToastMessage}
                  horde={horde}
                  setHorde={setHorde}
                  setPurchased={setPurchased}
                  user={user}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/monsterpics" element={<MonsterPics />}>
            <Route path="vampire" element={<Vampire />} />
            <Route path="ghost" element={<Ghost />} />
            <Route path="zombie" element={<Zombie />} />
            <Route path="ghoul" element={<Ghoul />} />
            <Route path="lich" element={<Lich />} />
            <Route path="imp" element={<Imp />} />
            <Route path="succubus" element={<Succubus />} />
            <Route path="hellhound" element={<Hellhound />} />
            <Route path="goblin" element={<Goblin />} />
            <Route path="orc" element={<Orc />} />
            <Route path="troll" element={<Troll />} />
            <Route path="werewolf" element={<Werewolf />} />
            <Route path="giantSpider" element={<GiantSpider />} />
            <Route path="direWolf" element={<DireWolf />} />
          </Route>
          <Route
            path="/orders"
            element={
              <ProtectedRoute user={user} setToastMessage={setToastMessage}>
                <OrderHistory user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <Login
                setUser={setUser}
                setToastMessage={setToastMessage}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                setToastMessage={setToastMessage}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;