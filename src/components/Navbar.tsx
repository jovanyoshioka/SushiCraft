import "./Navbar.scss";
import FixedLayout from "./FixedLayout";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const isActive = (path: string) =>
    pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <FixedLayout overlay>
      <nav className="sushi-navbar">
        <div className="sushi-navbar__brand">
          <Link to="/">
            <img
              src={`${import.meta.env.BASE_URL}SushiCraft.svg`}
              alt="SushiCraft"
              className="sushi-navbar__logo"
            />
          </Link>
        </div>
        <div className="sushi-navbar__links">
          {[
            { path: "/", label: "Home" },
            { path: "/challenge", label: "Challenge" },
            { path: "/staff", label: "Staff" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`sushi-navbar__link nav-link${isActive(path) ? " is-active" : ""}`}
            >
              <span className="sushi-navbar__label">{label}</span>
            </Link>
          ))}
        </div>
        <div className="sushi-navbar__actions">
          <Link
            to="/join"
            className="sushi-navbar__join apply-btn"
            aria-label="Join Now"
          >
            <span>Join Now</span>
          </Link>
        </div>
      </nav>
    </FixedLayout>
  );
}
