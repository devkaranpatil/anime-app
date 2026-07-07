import { Link, NavLink, Outlet } from "react-router-dom";
import "../styles/MainLayout.css";
import { SearchBar } from "../components/SearchBar/SearchBar";

const MainLayout = () => (
  <>
    <header className="app-header">
      <nav className="app-nav" aria-label="Main navigation">
        <Link className="app-brand" to="/">
          <span style={{ color: "red", fontSize: 30 }}>FlavorAnime</span>
        </Link>

        <div className="app-nav-links">
          <NavLink
            className={({ isActive }) =>
              `app-nav-link${isActive ? " active" : ""}`
            }
            end
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `app-nav-link${isActive ? " active" : ""}`
            }
            to="/favorites"
          >
            Favorites
          </NavLink>
        </div>
        <div className="nav-search">
          <SearchBar />
        </div>

        <div className="nav-auth">sign in / sign up</div>
      </nav>
    </header>

    <main className="app-main">
      <Outlet />
    </main>
  </>
);

export default MainLayout;
