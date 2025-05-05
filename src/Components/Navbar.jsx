import {
  School2,
  LayoutGrid,
  GitCompareArrows,
  Menu,
  Settings,
  UserRoundCog,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import "./navbar.css";
import { Link, Outlet } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  return (
    <div className={`sidebar ${menuOpen ? "menu-open" : "menu-close"}`}>
      <div className="logo-detalles">
        <i>
          <School2 className="dashboard-icon" />
        </i>
        <span className="logo-name">U.Distrital</span>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">
            <i>
              <LayoutGrid className="dashboard-icon" />
            </i>
            <span className="link_name">Inicio</span>
          </Link>
        </li>
        <li>
          <Link to="/Solicitudes">
            <i>
              <GitCompareArrows className="dashboard-icon" />
            </i>
            <span className="link_name">Solicitudes</span>
          </Link>
        </li>
        <li>
          <Link to="/Homologaciones">
            <i>
              <CheckCircle className="dashboard-icon" />
            </i>
            <span className="link_name">Homologacion</span>
          </Link>
        </li>
        <li>
          <Link to="/Usuarios">
            <i>
              <UserRoundCog className="dashboard-icon" />
            </i>
            <span className="link_name">Usuarios</span>
          </Link>
        </li>
        <li>
          <Link to="/Configuracion">
            <i>
              <Settings className="dashboard-icon" />
            </i>
            <span className="link_name">Configuracion</span>
          </Link>
        </li>
      </ul>
      <div className="menu-toggle" onClick={toggleMenu}>
        <i>
          <Menu className="dashboard-icon-Menu" />
        </i>
      </div>
      <Outlet />
    </div>
  );
}
