import { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import MonsterHorde from "./pages/MonsterHorde";
import styles from "./Styles.module.css";
import MonsterPage from './pages/MonsterPage.jsx';
import MonsterPics from './pages/MonsterPics.jsx';
import Checkout from './pages/Checkout';
import About from './pages/About.jsx';
import Register from "./pages/Registration.jsx";
import Login from "./pages/Login";
import ProtectedRoute from './components/ProtectedRoute.jsx';
import OrderHistory from "./pages/OrderHistory";
import Account from "./pages/Account";
import AuthSection from './components/AuthSection.jsx';
import { useLocalStorage, getFromStorage, saveToStorage } from './hooks/useLocalStorage';

const Monster = lazy(() => import('./pages/MonsterForm'))

function App() {
  // Style function for active links 
  const navLinkStyles = ({ isActive }) => ({
    color: isActive ? '#DC143C' : 'inherit',
    textDecoration: isActive ? 'none' : 'underline',
    fontWeight: isActive ? 'bold' : 'normal',
    padding: '5px 10px'
  });

  // Persist current user login state
  const [user, setUser] = useLocalStorage("currentUser", null);

  // Persist purchased flag across sessions
  const [purchased, setPurchased] = useLocalStorage("purchased", false);

  // Persist theme preference (light/dark mode)
  const [theme, setTheme] = useLocalStorage("theme", "light");

  // Persist user's shopping horde based on their email
  const [horde, setHorde] = useState([]);
  useEffect(() => {
    if (!user) {
      setHorde([]);
      return;
    }
    // Load user's horde from storage or initialize empty
    const saved = getFromStorage(`horde_${user.email}`, []);
    setHorde(saved);
  }, [user]);

  // Save horde to storage whenever it changes
  useEffect(() => {
    if (!user) return;
    saveToStorage(`horde_${user.email}`, horde);
  }, [horde, user]);

  // Calculate total quantity of items in horde
  const totalQuantity = horde.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Apply theme to document body and sync with DOM
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <AuthSection
        user={user}
        setUser={setUser}
        theme={theme}
        setTheme={setTheme}
      />
      <nav className={styles.pagesCenter}>
        <NavLink to="/monster-app" style={navLinkStyles}>Shop</NavLink> |{" "}
        <NavLink to="/horde" style={navLinkStyles}>
          Monster Horde {totalQuantity > 0 && `(${totalQuantity})`}
        </NavLink> |{" "}
        <NavLink to="/about" style={navLinkStyles}>About</NavLink> |{" "}
        <NavLink to="/monsterpics" style={navLinkStyles}>Products</NavLink>
      </nav>
      <div className={styles.appCenter}>
        <Routes>
          <Route
            path="/account"
            element={
              <ProtectedRoute 
              user={user} 
              >
                <Account
                  user={user}
                  setUser={setUser}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/monster-app" element={
            <Suspense fallback={<div>Loading options...</div>}>
              <Monster
                setHorde={setHorde}
                horde={horde}
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
              <ProtectedRoute 
              user={user} 
              >
                <Checkout
                  horde={horde}
                  setHorde={setHorde}
                  setPurchased={setPurchased}
                  user={user}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/monsterpics" element={<MonsterPics />}>
            <Route path=":type" element={<MonsterPage />} />
          </Route>
          <Route
            path="/orders"
            element={
              <ProtectedRoute 
              user={user} 
              >
                <OrderHistory user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <Login
                setUser={setUser}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;