import { NavLink } from "react-router";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const NavBar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: "/s3", label: "S3" },
    { href: "/gf", label: "Goods Flow" },
    { href: "/charts", label: "Charts" },
  ];

  return (
    <div className="flex flex-col items-center bg-gray-50 w-full">
      <nav className="hidden lg:flex w-full h-16 bg-menu text-menuText  items-center justify-center shadow-md">
        <ul className="flex space-x-10">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <NavLink to={href} className="text-lg font-bold hover:underline">
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={toggleMenu}
        className="lg:hidden fixed right-4 top-4 font-bold  bg-menu text-menuText px-4 py-2 rounded-lg shadow-lg"
      >
        {isMenuOpen ? "Close" : "Menu"}
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-menu bg-opacity-90 text-menuText flex flex-col items-center justify-center z-40 lg:hidden">
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-menuText text-3xl"
          >
            <AiOutlineClose />
          </button>

          <nav>
            <ul className="space-y-6 text-center">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <NavLink
                    to={href}
                    onClick={toggleMenu}
                    className="text-2xl font-bold hover:underline"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default NavBar;
