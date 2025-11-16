import React from "react";
import { SearchCode, Sun } from "lucide-react";

const Navbar = () => {
  return (
    <>
      <div
        className="nav flex items-center justify-between h-[75px] bg-zinc-900"
        style={{ padding: "0px 150px", borderBottom: "1px solid #27272a" }}
      >
        <div className="logo flex items-center gap-[10px]">
          <SearchCode size={30} color="#9333ea" />
          <span className="text-2xl font-bold text-white ml-2">Code Lens</span>
        </div>
        <div className="icons flex items-center gap-[20px]">
          <a
            href="https://kishore-portfolio-45.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-medium hover:underline transition-all"
          >
            Contact Me
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
