import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function CollapsableComponent(props) {
  const [menuStatus, setMenuStatus] = useState(true);
  const location = useLocation();
  return (
    <li className="menu">
      <a
        href="#"
        onClick={() => setMenuStatus((status) => !status)}
        className={`dropdown-toggle ${menuStatus ? "" : "collapsed"}`}
        aria-expanded={menuStatus}
      >
        <div className="">
          {props.svg}
          <span>{props.name}</span>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="feather feather-chevron-right"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </a>
      <ul
        className={`submenu list-unstyled collapse ${menuStatus ? "show" : ""}`}
      >
        {props.subMenu.map((menu) => (
          <li className={location.pathname === menu.link ? "active" : ""}>
            <NavLink to={menu.link}> {menu.name} </NavLink>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default CollapsableComponent;
