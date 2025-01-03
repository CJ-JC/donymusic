import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Navbar as MTNavbar,
  MobileNav,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "/img/logo-day.svg";
import axios from "axios";
import { checkAuthStatus } from "../utils/CheckAuthStatus";
import { useDispatch, useSelector } from "react-redux";
import { loggedOut } from "@/reducer/auth";
import Loading from "../utils/Loading";
import AccountDropdown from "../utils/AccountDropdown";

export function Navbar({ brandName, action }) {
  const [openNav, setOpenNav] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const handleLinkClick = () => {
    setOpenNav(false);
  };

  useEffect(() => {
    checkAuthStatus(dispatch, setAuthLoading);
  }, [dispatch]);

  if (authLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const logout = () => {
    axios.post("/api/user/logout");
    dispatch(loggedOut());
    navigate("/");
  };

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <NavLink
        to="/"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          `group flex items-center rounded-lg p-1 px-2 ${
            isActive
              ? "border-b border-gray-500 font-medium text-gray-800"
              : "bg-white font-medium text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          }`
        }
      >
        Accueil
      </NavLink>

      <NavLink
        to="/courses"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          `group flex items-center rounded-lg p-1 px-2 ${
            isActive
              ? "border-b border-gray-500 font-medium text-gray-800"
              : "bg-white font-medium text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          }`
        }
      >
        Nos formations
      </NavLink>
      <NavLink
        to="/master-class"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          `group flex items-center rounded-lg p-1 px-2 ${
            isActive
              ? "border-b border-gray-500 font-medium text-gray-800"
              : "bg-white font-medium text-gray-600 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          }`
        }
      >
        Masterclass
      </NavLink>
    </ul>
  );

  return (
    <MTNavbar
      color="transparent"
      className="mx-auto max-w-screen-xl border-b p-3"
    >
      <div className="container mx-auto flex items-center justify-between text-black">
        <Link to="/" onClick={handleLinkClick}>
          {brandName}
        </Link>
        <div className="hidden lg:block">{navList}</div>
        <div className="hidden gap-2 lg:flex">
          {isLoggedIn && user ? (
            <>
              <AccountDropdown user={user} logout={logout} />
            </>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="outlined" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button variant="gradient" size="sm" fullWidth>
                  S'inscrire
                </Button>
              </Link>
            </>
          )}
        </div>
        <IconButton
          variant="text"
          size="sm"
          color="white"
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <MobileNav
        className="absolute left-2/4 z-10 w-[350px] -translate-x-2/4 rounded-xl border bg-white px-4 pb-4 pt-2 text-blue-gray-900"
        open={openNav}
      >
        <div className="container mx-auto">
          {navList}
          <a
            href="https://www.material-tailwind.com/blocks/react?ref=mtkr"
            target="_blank"
            className="mb-2 block text-black"
          >
            <Button variant="gradient" size="sm" fullWidth>
              pro version
            </Button>
          </a>
          {React.cloneElement(action, {
            className: "w-full block",
          })}
        </div>
      </MobileNav>
    </MTNavbar>
  );
}

Navbar.defaultProps = {
  brandName: <img src={logo} alt="Logo" className="h-14 w-auto" />,
  action: (
    <Link to="/sign-in">
      <Button variant="gradient" size="sm" fullWidth>
        S'authentifier
      </Button>
    </Link>
  ),
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;
