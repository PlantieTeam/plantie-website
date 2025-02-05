import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
const Header: FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [humburgerMenuOpen, setHumburgerMenuOpen] = useState(false);

  const location = useLocation();
  console.log(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Adjust the scroll threshold as needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const openHandler = () => {
    setHumburgerMenuOpen((prev) => !prev);
  };
  const linkStyle =
    " text-center flex items-center px-0 justify-center text-center h-full w-full text-white hover:text-white rounded hover:bg-white/25 py-1 px-2  box-content";
    const linkActivatedStyle = "text-white bg-white/25 "
  return (
    <>
      <header
        className={`fixed  flex justify-between items-center h-14  left-1/2 transform -translate-x-1/2 border-white/20 z-30  transition-all duration-300 m-auto   ${
          isScrolled
            ? "2xl:w-2/6 w-11/12 px-4  rounded-md  border-opacity-25  top-5 h-14   "
            : "2xl:w-4/5 w-11/12  top-2 border-opacity-0 "
        }`}
      >
        {isScrolled && (
          <div className="backdrop-blur-xl backdrop-brightness-150   bg-black/25  left-0 top-0 box-content rounded-md  absolute w-full   h-full"></div>
        )}
        <div className="flex items-center gap-2 ">
          {!isScrolled && <img src={logo} alt="" className="w-12" />}
          <span className={`z-10  ${isScrolled ? "text-2xl " : "text-4xl"}`}>
            Plantie
          </span>
        </div>

        <nav
          className={`md:justify-center justify-evenly items-center  md:flex hidden ${
            isScrolled ? "bg-[#1a1a1a]/25 w-3/5 overflow-hidden h-4/5  " : "w-2/6 h-3/5 md:gap-5"
          } text-sm rounded   z-10`}
        >
          <Link
            className={` ${
              location.pathname === "/app" ? linkActivatedStyle: ""
            } ${linkStyle}`}
            to={"/app"}
          >
            App
          </Link>
          <Link
            className={` ${
              location.pathname === "/library" ? linkActivatedStyle : ""
            } ${linkStyle}`}
            to={"/library"}
          >
            Library
          </Link>
          <Link
            className={` ${
              location.pathname === "/news" ? linkActivatedStyle : ""
            } ${linkStyle}`}
            to={"/news"}
          >
            News
          </Link>
          <Link
            className={` ${
              location.pathname === "/app-usage" ? linkActivatedStyle : ""
            } ${linkStyle}`}
            to={"/app-usage"}
          >
            App Usage
          </Link>
        </nav>

        {/* mobile nav */}
        <div
          className="w-10 h-10 p-0 flex items-center justify-evenly flex-col z-10 bg-white outline-none rounded-lg md:hidden relative "
          onClick={openHandler}
        >
          <div
            className={`w-4/6 absolute top-[25%] bg-black h-[2px] rounded-full transition-all duration-700 ${
              humburgerMenuOpen ? " rotate-45 top-[50%]" : ""
            }`}
          ></div>
          <div
            className={`w-4/6 absolute top-[50%] bg-black h-[2px] rounded-full transition-all duration-700 ${
              humburgerMenuOpen ? " -rotate-45 top-[50%]" : ""
            }`}
          ></div>
          <div
            className={`w-4/6 absolute top-[75%] bg-black h-[2px] rounded-full transition-all duration-700 ${
              humburgerMenuOpen ? " -rotate-45 !top-[50%]" : ""
            }`}
          ></div>
        </div>
      </header>
      <div
        className={`fixed w-full z-20 ${
          humburgerMenuOpen ? "flex" : " hidden"
        }`}
      >
        <div className="bg-white/10 backdrop-blur-xl  absolute w-[110%] h-[100vh] left-0 top-0 p-0 m-0"></div>
        <nav className="absolute top-20  left-1/2 transform -translate-x-1/2 w-11/12 p-4   bg-black/90  rounded-2xl ">
          <Link
            className={` ${
              location.pathname === "/app" ? "bg-white text-black" : ""
            } ${linkStyle}`}
            to={"/app"}
          >
            App
          </Link>
          <Link
            className={` ${
              location.pathname === "/library" ? "bg-white text-black" : ""
            } ${linkStyle}`}
            to={"/library"}
          >
            Library
          </Link>
          <Link
            className={` ${
              location.pathname === "/news" ? "bg-white text-black" : ""
            } ${linkStyle}`}
            to={"/news"}
          >
            News
          </Link>
          <Link
            className={` ${
              location.pathname === "/app-usage" ? "bg-white text-black" : ""
            } ${linkStyle}`}
            to={"/app-usage"}
          >
            App Usage
          </Link>
        </nav>
      </div>
    </>
  );
};
export default Header;
