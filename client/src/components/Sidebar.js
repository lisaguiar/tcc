import React from 'react';
import { MdOutlineGroup } from "react-icons/md";
import { RiInboxLine, RiNotification3Line, RiBookmarkLine, RiSearchLine } from "react-icons/ri";
import { FaRegCalendarAlt, FaCubes } from "react-icons/fa";

const SidebarItem = (props) => {
  return (
    <li className="list-none w-full group relative flex items-center">
      <a
        href={props.link}
        className="flex text-white hover:text-white relative items-center justify-center"
      >
        <div className="relative flex items-center">
          {props.icon}
          <span className="absolute top-full left-1/2 transform -translate-x-1/2 z-3 text-white bg-black shadow-md px-6 py-2 text-sm font-normal border rounded whitespace-nowrap opacity-0 pointer-events-none transition-all duration-400 group-hover:opacity-100 group-hover:pointer-events-auto">
            {props.description}
          </span>
        </div>
      </a>
    </li>
  );
};

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-96 h-screen w-sidebar bg-black transition-all duration-500 ease">
      <ul className="wx-auto h-full w-full">
        <SidebarItem link="#" icon={<RiInboxLine color="white" size={20} />} description="Área de trabalho" />
        <SidebarItem link="#" icon={<RiNotification3Line />} description="Notificação" />
        <SidebarItem link="#" icon={<MdOutlineGroup />} description="Compartilhado" />
        <SidebarItem link="#" icon={<FaRegCalendarAlt />} description="Calendário" />
        <SidebarItem link="#" icon={<RiBookmarkLine />} description="Favoritos" />
        <SidebarItem link="#" icon={<RiSearchLine />} description="Pesquisar" />
        <SidebarItem link="#" icon={<FaCubes />} description="Gadgets" />
      </ul>
    </div>
  );
}

export default Sidebar;
