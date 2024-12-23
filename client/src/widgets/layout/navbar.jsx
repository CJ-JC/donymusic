import React from "react";
import { Link } from "react-router-dom";
import {
  Navbar as MTNavbar,
  MobileNav,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "/img/logo-day.svg";

export function Navbar({ brandName, action }) {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const handleLinkClick = () => {
    setOpenNav(false);
  };

  //   const isAdmin = user?.role === "admin";
  const isAdmin = true;

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 text-inherit lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link to="/" onClick={handleLinkClick}>
        Accueil
      </Link>
      <Link to="/courses" onClick={handleLinkClick}>
        Nos formations
      </Link>
      <Link to="/master-class" onClick={handleLinkClick}>
        Masterclass
      </Link>
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
          <Link to="/sign-in">
            <Button variant="gradient" size="sm" fullWidth>
              S'authentifier
            </Button>
          </Link>
          {isAdmin && (
            <Link to="/administrator">
              <Button variant="variant" color="red" size="sm" fullWidth>
                Administrateur
              </Button>
            </Link>
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
            <Button variant="gradiant" size="sm" fullWidth>
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
