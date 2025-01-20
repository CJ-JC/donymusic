import React, { useState } from "react";
import {
  BadgeEuro,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Tv,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { Button, Typography } from "@material-tailwind/react";
import CloseIcon from "@mui/icons-material/Close";
import { NavLink } from "react-router-dom";

const Aside = ({ logout, isSidebarOpen, setIsSidebarOpen, user }) => {
  return (
    <aside
      id="cta-button-sidebar"
      className={`fixed inset-y-0 z-50 h-full w-80 flex-col border-r bg-[#1C2534]  shadow-sm transition-transform duration-300 dark:bg-[#25303F]
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    md:block md:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="flex h-screen flex-col overflow-y-auto border-r shadow-sm">
        <div className="flex h-20 w-full items-center border-b p-4">
          <Typography
            variant="h5"
            className="text-center font-semibold"
            color="white"
          >
            Donymusic
          </Typography>
          <CloseIcon
            className={`absolute right-4 top-6 h-6 w-6 rounded-sm text-gray-500 opacity-70 transition-colors hover:text-gray-700 md:opacity-0 ${
              isSidebarOpen ? "cursor-pointer" : "disabled"
            }`}
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
        <ul className="h-screen w-full p-2 font-medium">
          <li className="my-1">
            <NavLink
              to={"/administrator"}
              end
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 ${
                  isActive
                    ? "bg-[#333A48] font-medium text-white dark:bg-gray-100 dark:text-black"
                    : "font-medium text-gray-400 hover:bg-[#333A48] dark:hover:bg-gray-200 dark:hover:text-black"
                }`
              }
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="ms-3">Dashboard</span>
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink
              to={"/administrator/courses"}
              end
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 ${
                  isActive
                    ? "bg-[#333A48] font-medium text-white dark:bg-gray-100 dark:text-black"
                    : "font-medium text-gray-400 hover:bg-[#333A48] dark:hover:bg-gray-200 dark:hover:text-black"
                }`
              }
            >
              <Tv className="h-5 w-5" />
              <span className="ms-3">Formations</span>
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink
              to={"/administrator/masterclass"}
              end
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 ${
                  isActive
                    ? "bg-[#333A48] font-medium text-white dark:bg-gray-100 dark:text-black"
                    : "font-medium text-gray-400 hover:bg-[#333A48] dark:hover:bg-gray-200 dark:hover:text-black"
                }`
              }
            >
              <GraduationCap className="h-5 w-5" />
              <span className="ms-3">Masterclass</span>
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink
              to={"/administrator/instructors"}
              end
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 ${
                  isActive
                    ? "bg-[#333A48] font-medium text-white dark:bg-gray-100 dark:text-black"
                    : "font-medium text-gray-400 hover:bg-[#333A48] dark:hover:bg-gray-200 dark:hover:text-black"
                }`
              }
            >
              <Users className="h-5 w-5" />
              <span className="ms-3">Instructeurs</span>
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink
              to={"/administrator/users"}
              end
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 ${
                  isActive
                    ? "bg-[#333A48] font-medium text-white dark:bg-gray-100 dark:text-black"
                    : "font-medium text-gray-400 hover:bg-[#333A48] dark:hover:bg-gray-200 dark:hover:text-black"
                }`
              }
            >
              <User className="h-5 w-5" />
              <span className="ms-3">Utilisateurs</span>
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink
              to={"/administrator/remise"}
              end
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 ${
                  isActive
                    ? "bg-[#333A48] font-medium text-white dark:bg-gray-100 dark:text-black"
                    : "font-medium text-gray-400 hover:bg-[#333A48] dark:hover:bg-gray-200 dark:hover:text-black"
                }`
              }
            >
              <BadgeEuro className="h-5 w-5" />
              <span className="ms-3">Remise</span>
            </NavLink>
          </li>
          <li className="my-1">
            <NavLink
              to={`/administrator/profile`}
              end
              className={({ isActive }) =>
                `group flex items-center rounded-lg p-2 ${
                  isActive
                    ? "bg-[#333A48] font-medium text-white dark:bg-gray-100 dark:text-black"
                    : "font-medium text-gray-400 hover:bg-[#333A48] dark:hover:bg-gray-200 dark:hover:text-black"
                }`
              }
            >
              <Wrench className="h-5 w-5" />
              <span className="ms-3">Mon compte</span>
            </NavLink>
          </li>
        </ul>
        <hr />
        <ul className="my-5 flex justify-center">
          <Button
            onClick={logout}
            variant="outlined"
            size="sm"
            className="flex items-center bg-white focus:outline-none"
          >
            <LogOut className="mr-1 h-4 w-4" /> Déconnexion
          </Button>
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
