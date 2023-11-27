import React from 'react';
import { FaBookmark, FaRegBell, FaBox, FaCubes, FaUserFriends, FaTh, FaSearch, FaSmile, FaRegCalendarAlt } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { RiInboxLine, RiNotification3Line, RiNotification3Fill, RiBookmarkLine, RiStarLine, RiStarFill, RiHomeLine, RiSearchLine } from "react-icons/ri"
import { MdOutlineGroup } from "react-icons/md"
import '../styles/Sidebar.css'

const SidebarItem = (props) => {
  return (
    <li className='mb-8'>
      <a href={props.link} className="flex items-center text-white hover:text-white">
        <div className="h-12 w-auto text-center">{props.icon}</div>
        <span className="ml-4">{props.description}</span>
      </a>
      <span className="tooltip">{props.description}</span>
  </li>
  )
}

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-16 bg-black transition-all duration-500 ease">
      <ul className="nav-list">
        <SidebarItem link="#" icon={<RiInboxLine color="white" />} description="Área de trabalho" />
        <SidebarItem link="#" icon={<RiNotification3Line color="white" />} description="Notificação" />
        <SidebarItem link="#" icon={<MdOutlineGroup />} description="Compartilhado" />
        <SidebarItem link="#" icon={<FaRegCalendarAlt />} description="Calendário" />
        <SidebarItem link="#" icon={<RiBookmarkLine />} description="Favoritos" />
        <SidebarItem link="#" icon={<RiSearchLine />} description="Pesquisar" />
        <SidebarItem link="#" icon={<FaCubes />} description="Gadgets" />
      </ul>
    </div>
  )
}

export default Sidebar