import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) {
      setShow(false);
    } else {
      setShow(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const getLinkClass = (path) => {
    return location.pathname === path ? "border-b-2 border-orange-500" : "";
  };

  return (
    <nav
      className={`fixed w-full top-0 left-0 bg-white bg-opacity-80 shadow-lg transition-all duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <img className="w-30 h-10" src="/assets/logo.webp" alt="Logo" />
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/work"
                className={`px-3 py-2  text-sm font-medium ${getLinkClass(
                  "/work"
                )}`}
              >
                Work
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 text-sm font-medium ${getLinkClass(
                  "/about"
                )}`}
              >
                About
              </Link>
              <Link
                to="/services"
                className={`px-3 py-2  text-sm font-medium ${getLinkClass(
                  "/services"
                )}`}
              >
                Services
              </Link>
              <Link
                to="/"
                className={`px-3 py-2  text-sm font-medium ${getLinkClass(
                  "/"
                )}`}
              >
                Ideas
              </Link>
              <Link
                to="/careers"
                className={`px-3 py-2  text-sm font-medium ${getLinkClass(
                  "/careers"
                )}`}
              >
                Careers
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 text-sm font-medium ${getLinkClass(
                  "/contact"
                )}`}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
