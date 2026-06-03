import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { div, span } from "framer-motion/client";

const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "App", path: "/app",disabled:false },
    { label: "Library", path: "/library", disabled:true },
    { label: "News", path: "/news" ,disabled:true },
    { label: "App Usage", path: "/app-usage" ,disabled:true },
    { label: "Assistant", path: "/assistant",disabled:false  },
  ];

  const navItemStyle =
    "relative flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-300";

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed left-1/2 top-4 z-50 w-[95%] max-w-7xl -translate-x-1/2 transition-all duration-500`}
      >
        <div
          className={`relative flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 transition-all duration-500 sm:px-6 ${
            isScrolled
              ? "bg-black/25 shadow-2xl backdrop-blur-2xl"
              : "bg-white/5 backdrop-blur-md"
          }`}
        >
          {/* Glow */}
          <div className="absolute inset-0 rounded-2xl bg-white/[0.02]" />

          {/* LOGO */}
          <Link
            to="/"
            className="relative z-10 flex items-center gap-3"
          >
            <img
              src={logo}
              alt="Plantie"
              className={`transition-all duration-500 ${
                isScrolled ? "w-9" : "w-11"
              }`}
            />

            <span
              className={`font-bold tracking-tight text-white transition-all duration-500 ${
                isScrolled
                  ? "text-2xl"
                  : "text-3xl sm:text-4xl"
              }`}
            >
              Plantie
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="relative z-10 hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-xl md:flex">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;

              return (
                !link.disabled ?
                <Link
                  key={link.path}
                  to={link.path}
                  
                  className={`${navItemStyle} ${
                    active
                      ? "bg-white text-[#23075B] shadow-lg"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
                :
                <span className={`${navItemStyle} cursor-not-allowed text-white/80  hover:text-white`}>
                  {link.label}
                </span>
              );
            })}
          </nav>

          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl transition-all duration-300 hover:bg-white/20 md:hidden"
          >
            <div className="relative flex h-5 w-5 items-center justify-center">
              
              <span
                className={`absolute h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${
                  mobileOpen
                    ? "rotate-45"
                    : "-translate-y-[6px]"
                }`}
              />

              <span
                className={`absolute h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${
                  mobileOpen
                    ? "opacity-0"
                    : "opacity-100"
                }`}
              />

              <span
                className={`absolute h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${
                  mobileOpen
                    ? "-rotate-45"
                    : "translate-y-[6px]"
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* BACKDROP */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xl" />

        {/* MENU */}
        <div
          className={`absolute left-1/2 top-24 w-[90%] max-w-sm -translate-x-1/2 rounded-3xl border border-white/10 bg-[#12082e]/95 p-5 shadow-2xl backdrop-blur-2xl transition-all duration-500 ${
            mobileOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-10 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-2xl px-5 py-4 text-center text-base font-medium transition-all duration-300 ${
                    active
                      ? "bg-white text-[#23075B]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;