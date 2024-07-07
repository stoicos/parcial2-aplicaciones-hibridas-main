import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Navbar.module.scss"

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <header className={styles.Container}>
      <p>🎬 Mis Peliculas</p>
      <nav>
        <ul className={styles.Navbar}>
          {user ? (
            <>
              <li>
                <NavLink to="/">Directores</NavLink>
              </li>
              <li>
                <NavLink to={`/edit/${user.id}`}>Editar Perfil</NavLink>
              </li>
              <li>
                <NavLink onClick={() => logoutUser()} to="/login">
                  Logout
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
              <li>
                <NavLink to="/register">Register</NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
