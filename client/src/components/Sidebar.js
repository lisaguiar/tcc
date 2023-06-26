import React from 'react';
import { FaBookmark, FaRegBell, FaBox, FaCubes, FaUserFriends, FaTh, FaSearch, FaSmile, FaRegCalendarAlt } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { RiInboxLine, RiNotification3Line, RiNotification3Fill, RiBookmarkLine, RiStarLine, RiStarFill, RiHomeLine, RiSearchLine } from "react-icons/ri"
import { MdOutlineGroup } from "react-icons/md"
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
              <RiInboxLine color="white" />
            </div>

            <span className="link_name">Área de trabalho</span>
          </a>
          <span className="tooltip">Área de trabalho</span>
        </li>

        <li>
          <a href="#">
            <div className="icon">
              <RiNotification3Line color="white" />
            </div>

            <span className="link_name">Notificação</span>
          </a>
          <span className="tooltip">Notificação</span>
        </li>

        <li>
          <a href="#">
            <div className="icon">
              <MdOutlineGroup />
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
              <RiBookmarkLine />
            </div>

            <span className="link_name">Favoritos</span>
          </a>
          <span className="tooltip">Favoritos</span>
        </li>
        <li>
          <a href="#">
            <div className="icon">
              <RiSearchLine />
            </div>

            <span className="link_name">Pesquisar</span>
          </a>
          <span className="tooltip">Pesquisar</span>
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

export default Sidebar
