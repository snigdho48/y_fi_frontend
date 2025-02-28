import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import menuItems from '@/navmenu';
import { BiSolidLogInCircle } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className='h-screen overflow-y-auto '>
      <div className='flex flex-row justify-center items-center p-4 w-screen'>
      </div>
      <main className=''>
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;
