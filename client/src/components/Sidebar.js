import React from 'react';
import { FaBookmark, FaRegBell, FaBox, FaCubes, FaUserFriends, FaTh, FaSearch, FaSmile, FaRegCalendarAlt} from "react-icons/fa";
import {BiLogOut} from "react-icons/bi";
import '../styles/Sidebar.css'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo_details">
      </div>

      <ul className="nav-list">
        <li>
          <a href="#">
            <div className="icon">
            <FaBox/>
            </div>

            <span className="link_name">Área de trabalho</span>
          </a>
          <span className="tooltip">Área de trabalho</span>
        </li>

        <li>
          <a href="#">
          <div className="icon">
          <FaRegBell />
          </div>

            <span className="link_name">Notificação</span>
          </a>
          <span className="tooltip">Notificação</span>
        </li>

        <li>
          <a href="#">
          <div className="icon">
          <FaUserFriends />
          </div>

            <span className="link_name">Compartilhado</span>
          </a>
          <span className="tooltip">Compartilhado</span>
        </li>
        <li>
          <a href="#">
          <div className="icon">
          <FaRegCalendarAlt />
          </div>

            <span className="link_name">Calendario</span>
          </a>
          <span className="tooltip">Calendario</span>
        </li>
        <li>
          <a href="#">
          <div className="icon">
          <FaBookmark />
          </div>

            <span className="link_name">Favoritos</span>
          </a>
          <span className="tooltip">Favoritos</span>
        </li>
        <li>
          <a href="#">
          <div className="icon">
          <FaSmile />
          </div>

            <span className="link_name">Ajuda</span>
          </a>
          <span className="tooltip">Ajuda</span>
        </li>
        <li>
          <a href="#">
          <div className="icon">
          <FaCubes />
          </div>

            <span className="link_name">Gadgets</span>
          </a>
          <span className="tooltip">Gadgets</span>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
